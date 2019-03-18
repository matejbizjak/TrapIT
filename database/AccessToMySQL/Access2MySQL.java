import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;
import java.io.File;
import java.util.*;

public class Access2MySQL {
    //line split char for input txt file format
    public String dataSeperator = "~";
    //program variables, validation of existing pictures from database is set to FALSE by default
    public boolean validation;
    //temporary file for writing inbetween two file writing functions
    public String pathToTemp = "." + File.separator + "temp" + File.separator + "temp.txt";
    //input output folder
    public String inputPath = "." + File.separator + "vhodne" + File.separator;
    public String outputPath = "." + File.separator + "izhodne" + File.separator;
    //output file writers
    public BufferedWriter bwPath = null;
    public BufferedWriter bwMedia = null;
    public BufferedWriter bwSite = null;
    //output file names
    public String path  = "Image_name_koca_path.txt";
    public String site  = "Image_name_koca_site.txt";
    public String media = "Image_name_koca_media.txt";
    //input file names (default)
    public String input = "Image_name_koca.txt";
    //info counters
    public int nPaths = 0;
    public int nSites = 0;
    public int nMedia = 0;


    public Access2MySQL(String input, boolean validation) throws Exception{
        this.validation = validation;
        if(input != null){
            print(input);
            this.input = input;
            input = ((input.split("\\."))[0]) + "_";
            path =  input + "path.txt";
            site =  input + "site.txt";
            media = input + "media.txt";
        }
        proccessData();
    }

    public Access2MySQL() throws Exception{
        this(null, false);
    }

    public void initWriters() throws Exception{
        bwPath =    new BufferedWriter(new FileWriter(outputPath + path));
        bwSite =    new BufferedWriter(new FileWriter(outputPath + site));
        bwMedia =   new BufferedWriter(new FileWriter(outputPath + media));
    }

    public void writeInAllOutputFiles(String line) throws Exception{
        writePath(line);
        writeSite(line);
        writeMedia(line);
    }

    public void closeAllWriters() throws Exception{
        bwPath.close();
        bwSite.close();
        bwMedia.close();
    }

    //////////DATA VALIDATOR//////////
    public void proccessData() throws Exception{
        
        BufferedReader br = new BufferedReader(new FileReader(inputPath + input));
        BufferedWriter bw = new BufferedWriter(new FileWriter(pathToTemp));
        String[] lineSplit;
        String line = br.readLine();

        initWriters();
        System.out.println("Reading from file with name: " + input);
        if(validation) System.out.print("Checking which pictures exist on the hard drive, <V:\\2017\\> replaced with <D:\\PKP\\>, writing in output files ... ");
        else           System.out.print("Writing data inside the output files... ");
        //loops through input file, creates the needed files in foulder izhod
        int i = 0;
        while (line != null) {
            lineSplit = line.split(dataSeperator, -1);
            if (valid(lineSplit[1])) {
                writeInAllOutputFiles(line);
                bw.write(line);
                bw.newLine();
                i ++;
            }
            line = br.readLine();
        }

        closeAllWriters();
        bw.close();
        br.close();
        System.out.print("done.");
        System.out.printf("\n\nNumber photos from the database: %d \n", i);
        System.out.printf("Number of different image paths: %d \n", nPaths);
        System.out.printf("Number of different sites: %d \n", nSites);
        System.out.printf("Number of media table lines: %d \n\n", nMedia);
    }

    public boolean valid(String path) {
        if(!validation) return true;
        //checking procedure can be modiefied in this function
        String pictureFolderPath = "D:\\PKP\\slike\\17_Janezova_koca\\";
        path = path.replaceAll("/", "\\\\");
        path = path.replace("V:\\2017\\", pictureFolderPath);
        return (new File(path).isFile() && !(new File(path).isDirectory()));
    }
    /////////////////////////////////

    ////PATH TABLE WRITER///////////
    public ArrayList<String> allPaths = new ArrayList<String>();

    public void writePath(String line) throws Exception{
        String[] lineSplit;
        String path;
        lineSplit = line.split(dataSeperator, -1);
        lineSplit = lineSplit[1].split("/", -1);
        lineSplit[lineSplit.length - 2] = "";
        lineSplit[lineSplit.length - 1] = "";
        path = String.join("/", lineSplit);
        path = path.substring(0, path.length() - 1);
        if(allPaths.contains(path)) return;
        else{   
            allPaths.add(path);
            bwPath.write(path);
            bwPath.newLine();
            nPaths ++;
        }
    }
    ////////////////////////////////

    
    //////SITE TABLE WRITER/////////
    public ArrayList<String> allSites = new ArrayList<String>();

    public void writeSite(String line) throws Exception{
        String[] lineSplit = line.split(dataSeperator, -1);
        String site = lineSplit[3];

        if(allSites.contains(site)) return;
        else{   
            allSites.add(site);
            bwSite.write(site);
            bwSite.newLine();
            nSites ++;
        }
    }
    /////////////////////////////////
    public void print(String string){
        System.out.println(string);
    }
    //////MEDIA TABLE WRITER/////////
    public void writeMedia(String line) throws IOException{
        String[] lineSplit;
        String[] temp;
        String date, time, datetime, name, empty, image, interesting, comment, site, path;

        lineSplit = line.split(dataSeperator, -1);
        //// DATETIME
        //print(lineSplit[0] + " " + lineSplit.length);
        date = lineSplit[4];
        temp = date.split(" ", -1);
        date = temp[0];

        time = lineSplit[5];
        temp = time.split(" ", -1);
        time = temp[1];

        datetime = date + " " + time;
        //// EMPTY TODO
        empty = "0";
        //// IMAGE
        if(Objects.equals(lineSplit[7], "JPG") || Objects.equals(lineSplit[7], "PNG")) image = "1";
        else image = "0";
        /// INTERESTING TODO
        interesting = "0";
        /// COMMENT TODO
        comment = "";
        /// SITE
        site = lineSplit[3];
        /// PATH
        String[] nameT = new String[2];
        nameT[1] = lineSplit[6];   
        lineSplit = lineSplit[1].split("/", -1);
        nameT[0] = lineSplit[lineSplit.length - 2];
        name = String.join("/", nameT);
        lineSplit[lineSplit.length - 2] = "";
        lineSplit[lineSplit.length - 1] = "";
        path = String.join("/", lineSplit);
        path = path.substring(0, path.length() - 1);

        //form line
        line = datetime + dataSeperator + name + dataSeperator + empty + dataSeperator + image + dataSeperator + interesting + dataSeperator + comment + dataSeperator + site + dataSeperator + path;
        //print("-------------");
        bwMedia.write(line);
        bwMedia.newLine();
        nMedia ++;
    }
    /////////////////////////////////

    public static void main(String[] args){
        System.out.println("*Name of the input file can be declared in the arguments line example: java Access2MySQL Image_name.txt");
        System.out.println("*To validate if a image exists, you have to add -validate argument to the command line, and at the moment, change some of the source code <TODO>");
        System.out.println("");

        try{
            Access2MySQL converter;
            if (args.length == 1){ 
                if(Objects.equals(args[0], "-validate")) converter = new Access2MySQL(null, true);
                else                                     converter = new Access2MySQL(args[0], false);
            }
            else if (args.length == 2) {
                if (Objects.equals(args[0], "-validate"))      converter = new Access2MySQL(args[1], true);
                else if (Objects.equals(args[1], "-validate")) converter = new Access2MySQL(args[0], true);
                else
                {
                 System.out.println("Undefined argument used, exiting...");
                 System.exit(0);
                }
            }
            else converter = new Access2MySQL();
        }
        catch(Exception e){
            System.out.println(e);
            System.out.println("Something went wrong... :O");
        }
    }
}