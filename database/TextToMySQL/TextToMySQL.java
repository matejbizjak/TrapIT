import java.io.*;
import java.util.*;
import java.sql.*;

public class TextToMySQL {
	public static void main(String[] args) {

		//Create a new scanner from the input files
		Scanner siteFile = openFile("textFiles/Image_name_koca_site.txt");
		Scanner pathFile = openFile("textFiles/Image_name_koca_path.txt");
		Scanner mediaFile = openFile("textFiles/Image_name_koca_media.txt");
		
		
		//Get connection to database
		Connection myDBConnection = getDBConnection();
		
		System.out.println("Starting writing to sites");
		//Write sites to database
		sitesToDB(myDBConnection, siteFile);
		System.out.println("Finished writing to sites\n");
		
		System.out.println("Starting writing to paths");
		//Write path to database
		pathsToDB(myDBConnection, pathFile);
		System.out.println("Finished writing to paths\n");
		
		System.out.println("Starting writing to media");
		//Write media to database
		mediaToDB(myDBConnection, mediaFile);
		System.out.println("Finished writing to media\n");
		
	}
	
	public static Scanner openFile(String filename) {
		
		try {
			Scanner retScanner;
			retScanner = new Scanner(new File(filename));
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
			
			String driver = "com.mysql.cj.jdbc.Driver";
			String url = 	"jdbc:mysql://127.0.0.1:3306/trapit?"
							+ "useUnicode=true&"
							+ "useJDBCCompliantTimezoneShift=true&"
							+ "useLegacyDatetimeCode=false&"
							+ "serverTimezone=UTC&"
							+ "useSSL=false";
			String username = "root";
			String password = "password";
			
			Class.forName(driver);
			
			conn = DriverManager.getConnection(url, username, password);
			System.out.println("Connected to database");
			
			
		} catch(Exception e) {
			System.out.println("Error: " + e.getMessage());
			System.out.println("Here");
		}
		
		return conn;
	}

	public static void sitesToDB(Connection conn, Scanner input) {
		
		System.out.print("Progress: 0%");
		long count = 0;
		long total = fileLength(openFile("textFiles/Image_name_koca_site.txt"));
		
		while(input.hasNext()) {
			
			try {
				
				Statement writeStatement = conn.createStatement();
				
				String sql = 	"insert into site"
								+ "(name)"
								+ "values"
								+ "(\""+ input.nextLine() + "\")";
				
				writeStatement.executeUpdate(sql);
				count++;
				printPercentage(count, total);
				
			} catch(Exception e) {
				System.out.println("Error: " + e.getMessage());
			}
		}
		System.out.println();
	}

	public static void pathsToDB(Connection conn, Scanner input) {
		
		System.out.print("Progress: 0%");
		long count = 0;
		long total = fileLength(openFile("textFiles/Image_name_koca_path.txt"));
		
		while(input.hasNext()) {
			
			String line = input.nextLine();
			
			try {
				
				Statement writeStatement = conn.createStatement();
				
				String sql = 	"insert into path"
								+ "(value)"
								+ "values"
								+ "(\""+ line + "\")";
				
				writeStatement.executeUpdate(sql);
				count++;
				printPercentage(count, total);
				
			} catch(Exception e) {
				System.out.println("Error: " + e.getMessage());
			}
			
		}
		System.out.println();
	}

	public static void mediaToDB(Connection conn, Scanner input) {
		
		System.out.print("Progress: 0%");
		long count = 0;
		long total = fileLength(openFile("textFiles/Image_name_koca_media.txt"));
		
		while(input.hasNext()) {
			
			String line = input.nextLine();
			String[] lineElements = new String[8];
			lineElements = line.split(",");
			
			try {
				
				Statement writeStatement = conn.createStatement();
				
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
				
				writeStatement.executeUpdate(sql);
				count++;
				printPercentage(count, total);
				
			} catch(Exception e) {
				System.out.println("Error: " + e.getMessage() + " At: " + count);
			}
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