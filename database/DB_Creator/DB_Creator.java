import java.io.*;
import java.util.*;
import java.sql.*;

public class DB_Creator {
	public static void main(String[] args) {

		try {
			Properties loadSettings = new Properties();
			loadSettings.loadFromXML(new FileInputStream("Settings/settings.xml"));

			//Create output file to write to
			PrintWriter outputFile = new PrintWriter("Scripts/TrapIT_Setup.sql", "UTF-8");
			PrintWriter mediaFiller = new PrintWriter("Scripts/Media_Fill.sql", "UTF-8");

			//Copy database creation script to output file
			System.out.println("Copying database creation script to output file");
			copyInto(	"SourceFiles/" + loadSettings.getProperty("dbCreationScript"),
						outputFile);

			//Fill sites table script
			System.out.println("Generating site table script");
			sitesToScript(	"SourceFiles/" + loadSettings.getProperty("siteDataFile"),
							outputFile);

			//Fill paths table script
			System.out.println("Generating path table script");
			pathsToScript(	"SourceFiles/" + loadSettings.getProperty("pathDataFile"),
							outputFile);

			//Fill media table script
			System.out.println("Generating media table script");
			mediaToScript(	"SourceFiles/" + loadSettings.getProperty("mediaDataFile"),
							mediaFiller);

			//Copy script that removes duplicates
			System.out.println("Adding duplicate removal script to media table script");
			copyInto( "SourceFiles/" + loadSettings.getProperty("duplicateRemovalFile"),
						mediaFiller);

			//Fill tags table script
			System.out.println("Generating tag table script");
			tagsToScript(	"SourceFiles/" + loadSettings.getProperty("tagDataFile"),
							outputFile);

			//Copy role, user and project script to output file
			System.out.println("Copying role user and project script to output file");
			copyInto(	"SourceFiles/" + loadSettings.getProperty("roleUserProjectScript"),
						outputFile);

			outputFile.close();
			mediaFiller.close();

			if(args.length == 1) {
				//Write to database
				if(args[0].equals("-db")) {
					//Get connection to database
					Connection myDBConnection = getDBConnection(loadSettings);
					System.out.println("Starting writing to database");
					scriptToDB(myDBConnection, "Scripts/TrapIT_Setup.sql");
					System.out.println("Finished writing to database");
					System.out.println("Starting writing media to database");
					scriptToDB(myDBConnection, "Scripts/Media_Fill.sql");
					System.out.println("Finished writing media to database");
					System.out.println("Starting writing names to database");
					scriptToDB(myDBConnection, "Scripts/Translate.sql");
					System.out.println("Finished writing names to database");
				}
				else {
					System.out.println("Unknown option: " + args[0]);
				}
			}

		} catch(Exception e) {
			System.out.println("Error: " +  e.getMessage());
		}
		


	}

	public static Scanner openFile(String filename) {
		
		try {
			Scanner retScanner;
			retScanner = new Scanner(new File(filename), "UTF-8");
			return retScanner;
		}
		catch (Exception e) {
			System.out.println("Errror: " + e.getMessage());
			return null;
		}
	}

	public static void copyInto(String fName, PrintWriter outFile) {

		Scanner inFile = openFile(fName);

		long total = fileLength(openFile(fName));
		long count = 0;

		System.out.print("\t0%");
		while(inFile.hasNext()) {
			outFile.println(inFile.nextLine());
			count++;
			printPercentage(count, total);
		}
		outFile.println("");
		System.out.println("");
	}

	public static void sitesToScript(String fName, PrintWriter outFile) {
		
		Scanner inFile = openFile(fName);

		System.out.print("\t0%");
		long count = 0;
		long total = fileLength(openFile(fName));
		
		while(inFile.hasNext()) {
			
			String sql = 	"insert into site"
								+ "(name)"
								+ "values"
								+ "(\""+ inFile.nextLine() + "\");";
				
			outFile.println(sql);
			count++;
			printPercentage(count, total);
		}
		outFile.println();
		System.out.println();
	}

	public static void pathsToScript(String fName, PrintWriter outFile) {
		
		Scanner inFile = openFile(fName);

		System.out.print("\t0%");
		long count = 0;
		long total = fileLength(openFile(fName));
		
		while(inFile.hasNext()) {
			
			String line = inFile.nextLine();
			
			String sql = 	"insert into path"
								+ "(value)"
								+ "values"
								+ "(\""+ line + "\");";
				
			outFile.println(sql);
			count++;
			printPercentage(count, total);
			
		}
		outFile.println();
		System.out.println();
	}

	public static void mediaToScript(String fName, PrintWriter outFile) {
		
		Scanner inFile = openFile(fName);

		System.out.print("\t0%");
		long count = 0;
		long total = fileLength(openFile(fName));
		
		while(inFile.hasNext()) {
			
			String line = inFile.nextLine();
			//String[] lineElements = new String[8];
			String[] lineElements = line.split("~");
			
			String sql = 	"INSERT INTO media (`date`, `name`, `empty`, `image`, `interesting`, `comment`, `site_id`, `path_id`)" + 
								"VALUES (\""+ lineElements[0] + "\", \"" + lineElements[1] + "\", " + lineElements[2] + ", " + lineElements[3] + ", " + lineElements[4] + ", \"" + lineElements[5] + "\", (" + 
								"	SELECT site_id " + 
								"	FROM site " + 
								"	WHERE name=\"" + lineElements[6] + 
								"\"), (" + 
								"	SELECT path_id " + 
								"	FROM path " + 
								"	WHERE value=\"" + lineElements[7] + "\"" + 
								"));";
				
				outFile.println(sql);
				count++;
				printPercentage(count, total);
		}
		outFile.println();
		System.out.println();
	}

	public static long fileLength(Scanner input) {
		long length = 0;
		while(input.hasNext()) {
			length++;
			input.nextLine();
		}
		return length;
	}

	public static void printPercentage(double finished, double total) {
		
		if((int)((finished - 1)/total*100) <= 9) {
			System.out.print("\b\b");
		}
		else if((int)((finished - 1)/total*100) <= 99) {
			System.out.print("\b\b\b");
		}
		
		System.out.print((int)(finished/total*100) + "%");
		
	}

	public static void tagsToScript(String fName, PrintWriter outFile) {

		Scanner inFile = openFile(fName);

		String[] parents = new String[100];

		System.out.print("\t0%");
		long count = 0;
		long total = fileLength(openFile(fName));

        while(inFile.hasNext()) {
                
			String line = inFile.nextLine();
			String sql;
			line = line.replace("\t", "-");

			if(!line.equals("") && !line.replace("-", "").equals("")) {

				String[] inputs = line.split("\\s");

				//how deep does it go???
				int index = 0;
				while(inputs[0].charAt(index) == '-') {
					index++;
				}

				//Index is the number of tabs in front of the line,
				//it represents which parent the node should have

				switch(inputs[0].charAt(index)) {
					case('/'):
						//do nothing, this is a comment
						break;
					case(0xFEFF):
						//Special case only at the beginning of file, not significant
						break;
					case('>'):
						//This is a parent tag, it's parent is null
						//Insert string after '>' into table 'tag'
						sql =   "insert into tag "
								+ "(name, parent_tag_id, input, checkbox) "
								+ "values "
								+ "(\"" + inputs[0].substring(1) + "\", null, " + inputs[1] + ", " + inputs[2] + ");";
					
						outFile.println(sql);
						
						parents[index] = inputs[0].substring(1);

						break;
					case('+'):
						//This is a child tag, it's parent has the name stored in 'lastNode'
						//Insert string after '+' into table 'tag'

						sql = "";
						for(int i = 0; i < index; i++) {
							sql += '\t';
						}
						sql += 	"insert into tag "
									+ "(name, parent_tag_id, input, checkbox) "
									+ "values "
									+ "("
										+ "\"" + inputs[0].substring(index + 1) + "\", "
										+ "(select tag_id from "
										+ "(select * from tag) as tempTable "
										+ "where name=\"" + parents[index - 1] + "\" " + getParentSQL(index, 2, parents) + ", "
										+ inputs[1] + ", "
										+ inputs[2]
									+ ");";

						outFile.println(sql);
						parents[index] = inputs[0].substring(index + 1);
						break;
					default:
						//This is a tag vaue
						//Insert string in table 'tag_values'

						sql = "";
						for(int i = 0; i < index; i++) {
							sql += '\t';
						}
						sql += 	"insert into tag "
									+ "(name, parent_tag_id, input, checkbox) "
									+ "values "
									+ "("
										+ "\"" + inputs[0].substring(index) + "\", "
										+ "(select tag_id from "
										+ "(select * from tag) as tempTable "
										+ "where name=\"" + parents[index - 1] + "\" " + getParentSQL(index, 2, parents) + ", "
										+ inputs[1] + ", "
										+ inputs[2]
									+ ");";

						outFile.println(sql);
						break;
				}
			}
			count++;
			printPercentage(count, total);
		}
		outFile.println();
		System.out.println();
	}

	public static Connection getDBConnection(Properties loadSettings) {
		
		Connection conn = null;
		try {
			
			String url = loadSettings.getProperty("url");
			String username = loadSettings.getProperty("username");;
			String password = loadSettings.getProperty("password");;

			String driver = "com.mysql.cj.jdbc.Driver";

			Class.forName(driver);
			
			conn = DriverManager.getConnection(url, username, password);
			System.out.println("Connected to database");
			
		} catch(Exception e) {
			System.out.println("Error: " + e.getMessage());
		}
		
        return conn;
	}

	public static void scriptToDB(Connection conn, String sourceFile) {

		Scanner input = openFile(sourceFile);
		long count = 0;
		long total = fileLength(openFile(sourceFile));

		try {

			String sql = "";
			System.out.print("\t0%");
			while(input.hasNext()) {
				String line = input.nextLine();
				line.replace('\t', ' ');
				line = line.trim();
				if(!line.equals("") && !line.substring(0, 2).equals("--")) {

					if(line.charAt(line.length() - 1) != ';') {
						sql += line + ' ';
					}
					else {
						sql += line + ' ';
						Statement writeStatement = conn.createStatement();
						writeStatement.executeUpdate(sql);
						sql = "";
					}
				}
				count++;
				printPercentage(count, total);
			}
			System.out.println("");
		} catch(Exception e) {
			System.out.println("Error: " + e.getMessage());
		}
	}

	public static String getParentSQL(int index, int curr, String[] strings) {
		if(index - curr < 0) {
			return "and parent_tag_id is null)";
		}
		else {
			return "and parent_tag_id=(select tag_id from (select * from tag) as tempTable where name=\"" + strings[index - curr] + "\" " + getParentSQL(index, curr + 1, strings) + ")";
		}
	}
}