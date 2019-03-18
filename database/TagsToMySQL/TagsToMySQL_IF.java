import java.io.*;
import java.util.*;
import java.sql.*;

public class TagsToMySQL_IF {
	public static void main(String[] args) {

		if(args.length == 1) {
			//Create a new scanner from the input files
			Scanner tagFile = openFile("tags_2_2.txt");
		
			System.out.println("Starting writing to tags");
			//Write to script
			if(args[0].equals("-script")) {
				tagsToScript(tagFile);
			}
			if(args[0].equals("-db")) {
				//Get connection to database
				Connection myDBConnection = getDBConnection();
				tagsToDB(myDBConnection, tagFile);
			}
        
			System.out.println("Finished writing to tags\n");
		}
		else if(args.length > 1) {
			System.out.println("Error: Too many arguments passed");
		}
		else {
			System.out.println("Error: You must define whether to write to .sql file or database directly.\n" + 
								"Add option -script or -db respectively");
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

	public static Connection getDBConnection() {
		
		Connection conn = null;
		try {
			
			String url = "";
			String username = "";
			String password = "";

			Scanner connProperties = openFile("db_conn_properties.txt");
			int whichInfo = 0;
			while(connProperties.hasNext()) {
				String line = connProperties.nextLine();
				if(!line.equals("")) {
					if(line.charAt(0) != '/') {
						switch(whichInfo) {
							case(0):
								url = line;
								whichInfo++;
								break;
							case(1):
								username = line;
								whichInfo++;
								break;
							case(2):
								password = line;
								whichInfo++;
								break;
						}
					}
				}
			}

			String driver = "com.mysql.cj.jdbc.Driver";

			Class.forName(driver);
			
			conn = DriverManager.getConnection(url, username, password);
			System.out.println("Connected to database");
			
		} catch(Exception e) {
			System.out.println("Error: " + e.getMessage());
		}
		
        return conn;
	}

	public static void tagsToScript(Scanner input) {

		String[] parents = new String[100];

        try {
            PrintWriter outputFile = new PrintWriter("tagScriptIf.sql", "UTF-8");

            while(input.hasNext()) {
                
				String line = input.nextLine();
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
                                    + "(name, parent_tag_id, input) "
                                    + "values "
									+ "(\"" + inputs[0].substring(1) + "\", null, " + inputs[1] + ");";
						
							outputFile.println(sql);
							
							parents[index] = inputs[0].substring(1);

                            break;
						case('+'):
                            //This is a child tag, it's parent has the name stored in 'lastNode'
							//Insert string after '+' into table 'tag'

							


							sql = 	"\tinsert into tag "
									+ "(name, parent_tag_id, input) "
									+ "values "
									+ "("
										+ "\"" + inputs[0].substring(index + 1) + "\", "

										+ "(select if((select count(*) from (select * from tag) as tempTable where name=\"" + parents[index - 1] + "\") < 2,"
										+ "(select tag_id from (select * from tag) as tempTable where name=\"" + parents[index - 1] + "\"),"
										+ "(select tag_id from (select * from tag) as tempTable where name=\"" + parents[index - 1] + "\" and parent_tag_id=null)"
										+ ")),"
										+ inputs[1]
										
										/*
										+ "(select tag_id from "
										+ "(select * from tag) as tempTable "
										+ "where name=\"" + parents[index - 1] + "\"), "
										+ inputs[1]
										*/
									+ ");";

							outputFile.println(sql);
							parents[index] = inputs[0].substring(index + 1);
                            break;
                        default:
                            //This is a tag vaue
							//Insert string in table 'tag_values'
							if(index >= 2) {

								sql = 	"\t\tinsert into tag(name, parent_tag_id, input)"
										+ "values"
										+ "(\"" + inputs[0].substring(index) + "\","
											+ "(select if((select count(*) from (select * from tag) as tempTable where name=\"" + parents[index - 1] + "\") < 2,"
											+ "(select tag_id from (select * from tag) as tempTable where name=\"" + parents[index - 1] + "\"),"
											+ "(select tag_id from (select * from tag) as tempTable where name=\"" + parents[index - 1] + "\" and parent_tag_id=(select tag_id from (select * from tag) as tempTable where name=\"" + parents[index - 2] + "\")"
											+ "))),"
											+ inputs[1]
										+ ");";
							}
							else {
								sql = 	"\t\tinsert into tag "
										+ "(name, parent_tag_id, input) "
										+ "values "
										+ "("
											+ "\"" + inputs[0].substring(index) + "\", "
											+ "(select tag_id from "
											+ "(select * from tag) as tempTable "
											+ "where name=\"" + parents[index - 1] + "\" and parent_tag_id is null), "
											+ inputs[1]
										+ ");";
							}
							

							outputFile.println(sql);
                            break;
                    }
				}
            }

			outputFile.close();

        } catch(Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
		
		//System.out.println();
	}

	public static void tagsToDB(Connection conn, Scanner input) {
		
		System.out.print("Progress: 0%");
		long count = 0;
		long total = fileLength(openFile("tags_2_2.txt"));
        
		String[] parents = new String[100];

		try {

			Statement writeStatement = conn.createStatement();

            while(input.hasNext()) {
                
				String line = input.nextLine();
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
                                    + "(name, parent_tag_id, input) "
                                    + "values "
									+ "(\"" + inputs[0].substring(1) + "\", null, " + inputs[1] + ");";
						
							writeStatement.execute(sql);
							
							parents[index] = inputs[0].substring(1);

                            break;
						case('+'):
                            //This is a child tag, it's parent has the name stored in 'lastNode'
							//Insert string after '+' into table 'tag'

							sql = 	"\tinsert into tag "
									+ "(name, parent_tag_id, input) "
									+ "values "
									+ "("
										+ "\"" + inputs[0].substring(index + 1) + "\", "
										+ "(select tag_id from "
										+ "(select * from tag) as tempTable "
										+ "where name=\"" + parents[index - 1] + "\" and parent_tag_id is null), "
										+ inputs[1]
									+ ");";

							writeStatement.execute(sql);
							parents[index] = inputs[0].substring(index + 1);
                            break;
                        default:
                            //This is a tag vaue
							//Insert string in table 'tag_values'
							if(index >= 2) {
								sql = 	"\t\tinsert into tag "
										+ "(name, parent_tag_id, input) "
										+ "values "
										+ "("
											+ "\"" + inputs[0].substring(index) + "\", "
											+ "(select tag_id from "
											+ "(select * from tag) as tempTable "
											+ "where name=\"" + parents[index - 1] + "\" and parent_tag_id=(select tag_id from (select * from tag) as tempTable where name=\"" + parents[index - 2] + "\" and parent_tag_id is null)), "
											+ inputs[1]
										+ ");";
							}
							else {
								sql = 	"\t\tinsert into tag "
										+ "(name, parent_tag_id, input) "
										+ "values "
										+ "("
											+ "\"" + inputs[0].substring(index) + "\", "
											+ "(select tag_id from "
											+ "(select * from tag) as tempTable "
											+ "where name=\"" + parents[index - 1] + "\" and parent_tag_id is null), "
											+ inputs[1]
										+ ");";
							}
							

							writeStatement.execute(sql);
                            break;
                    }
				}
				
                count++;
                printPercentage(count, total);
            }

        } catch(Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
		
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
}