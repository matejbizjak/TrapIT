import java.io.*;
import java.util.*;
import javax.xml.parsers.*;
import javax.xml.xpath.*;
import org.w3c.dom.*;
import java.nio.charset.StandardCharsets;

public class Data2MySQL{
    //line split char for input txt file format
    public String dataSeperator = "~";
    //input output folder
    public String inputPath = "." + File.separator + "vhodne" + File.separator;
    public String outputPath = "." + File.separator + "izhodne" + File.separator;
    //output file writers
    public BufferedWriter bw = null;
    public BufferedReader br = null;
    //input file names (default)
    public String input = "Data_base.txt";
    public String output = "Tags_insert.sql";
    //if validation is enabled this
    public String outputValidation = "Tags_insert_valid.sql";
    //first is where your pics are placed in, second which static path you want the first to replace (for validating)
    public String picPath     = "D:\\PKP\\slike\\17_Janezova_koca\\";
    public String replaceThis = "V:\\2017\\";
    public boolean validate = false;
    //image identifier, viewer
    public String imageID = null;
    public String imageV  = null;
    public String imageP  = null;
    //string, number of different speiceis in Access (requiered for creating name array)
    public String temp = "";
    public int numSpecies = 45;
    //data for each Access species
    GenderBySpecies[] speciesData;
    //statistics
    public int[] specieCount;
    public int iSpecie;
    //arrays for debugging
    public ArrayList<String>  allMale = new ArrayList<String>();
    public ArrayList<String>  allFemale = new ArrayList<String>();
    public ArrayList<String>  allImmature = new ArrayList<String>();
    

    public Data2MySQL(boolean validate){
        this.validate = validate;
        if(validate) output = outputValidation;
        try
        {   
            br = new BufferedReader(new InputStreamReader(new FileInputStream(inputPath + input), StandardCharsets.UTF_8));
            bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outputPath + output), StandardCharsets.UTF_8));
            speciesData = new GenderBySpecies[numSpecies];
            specieCount = new int[numSpecies];
            createGenderData();
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
            System.exit(0);
        }
    }

    public Data2MySQL(){
        this(false);
    }

    public void printSystemSettings(){
        System.out.printf("Settings:\nvalidation: %b \ninputfile: %s \noutputfile: %s\n", validate, input, output);
    }

    //create static variables and reads lines
    public void createSQL() throws IOException{
        String line;
        int counter = 0;
        line = br.readLine();

        //create @specieID and @carrionID adn @activityID
        createStaticSQL();

        while(line  != null) 
        {   
            processLine(line);
            line = br.readLine();
            counter ++;
        }

        br.close();
        bw.close();
        System.out.println("Lines read: " + counter);
        System.out.println(System.getProperty("file.encoding"));
    }

    //processor of lines and dispacher of data
    public void processLine(String line) {
        String[] data;
        data    = line.split(dataSeperator, -1);
        //save viewer, and Access line ID
        imageV  = data[1];
        imageID = data[0];
        imageP  = data[4];
        //validate if image exists
        if(validate && !valid(imageP)) return;
        //add line that finds media_id of the picture, defined in the path, and saves it into @mediaID, which is used in every concurrent SQL script
        //checks if all fields are empty
        int i = 5;
        for(; i < data.length; i ++) 
            if(data[i].length() != 0) break;

        //set @userID and @mediaID variables
        if (i != data.length) {
            createMediaIdSQL(data[4]);
            createUserIdSQL(data[1]);
        }

        //create sql for carrion
        if (Objects.equals(data[11], "Yes")) createCarrionSQL();
        //create sql for species
        createSpeciesSQL(data[5],  stringToInt(data[6]),  stringToInt(data[7]),  stringToInt(data[8]),  stringToInt(data[9]));
        createSpeciesSQL(data[14], stringToInt(data[15]), stringToInt(data[16]), stringToInt(data[17]), stringToInt(data[18]));
        createSpeciesSQL(data[19], stringToInt(data[20]), stringToInt(data[21]), stringToInt(data[22]), stringToInt(data[23]));
        createSpeciesSQL(data[24], stringToInt(data[25]), 0,                     0,                     0);
        //create sql for human activity
        if(data[12].length() != 0) createHumanActivitySQL(data[12]);
        //create sql for comment
        if(data[13].length() != 0) createCommentSQL(data[13]);
        //create sql for interesting
        if(stringToInt(data[data.length-1]) == 1) createInterestingSQL();
    }

    public void createSpeciesSQL(String specie, int number, int male, int female, int immature){
        //if the field is empty, exit
        if(specie.length() == 0 || (number == 0 & !Objects.equals(specie, "No animals"))) return;
        //get tag_name for each gender and undefined
        specie = specie.replace(" ", "_");
        String[] specieName = findSpecieNames(specie);
        //save statistics data to array
        specieCount[iSpecie] += number;
        if(specieName == null) return;
        
        //ALL TAG POSSIBILITIES/////////
        //CASE X: generalSpecie == vrsta
        if(Objects.equals("vrsta", specieName[1]))
        {   
            //CASE X-A: male == female == immature
            if(Objects.equals(specieName[2],specieName[3]) && Objects.equals(specieName[3], specieName[4]))
            {
                //System.out.print("CASE X-A: ");
                //System.out.print(specie + " " + number + " " + male + " " + female + " " + immature + " " + imageID + "\n");
                createVrstaTagSQL();
                createTagIdSQL("vrsta", specieName[2]);
                createMediaTagSQL(number);
            }

            //CASE X-B: male == female != immature (different tag for immature)
            else if(Objects.equals(specieName[2], specieName[3])) {
                //System.out.print("CASE X-B: ");
                //System.out.print(specie + " " + number + " " + male + " " + female + " " + immature + " " + imageID + "\n");
                //creates different tags for immatures (they have a different name, so they exist as a sperate tag)
                if(immature > 0)
                {
                    number -= immature;
                    createVrstaTagSQL();
                    //1 layer deep tag
                    createTagIdSQL("vrsta", specieName[2]);
                    createMediaTagSQL(immature);
                    //2 layer deep tag
                    createTagIdSQL(specieName[2], specieName[4]);
                    createMediaTagSQL(immature);
                }
                //creates the rest the same
                if(number > 0)
                {
                    createVrstaTagSQL();
                    createTagIdSQL(specieName[1], specieName[2]);
                    createMediaTagSQL(number);
                }
            }
            else
            {   
                //yet undefined inside this case
                //used for debbgging, in case I missed any possible tags
                System.out.print("CASE X-UNDEF: ");
                System.out.print(specie + " " + number + " " + male + " " + female + " " + immature + " " + imageID + "\n");
                System.out.println("NOT ALL INFORMATION WILL BE SAVED TO THE DATABASE.");
            }
        }


        //CASE Y: generalSpecie != vrsta
        else 
        {   
            //CASE Y-A: male == female == immature
            if(Objects.equals(specieName[2], specieName[3]) && Objects.equals(specieName[3],  specieName[4]))
            {
                //System.out.print("CASE Y-A: ");
                //System.out.print(specie + " " + number + " " + male + " " + female + " " + immature + " " + imageID + "\n");
                createVrstaTagSQL(); 
                //1 layers deep tag
                createTagIdSQL("vrsta", specieName[1]);
                createMediaTagSQL(number);
                //2 layers deep tag
                createTagIdSQL(specieName[1], specieName[2]);
                createMediaTagSQL(number);

            }

            //CASE Y-B: male == female != immature
            else if(Objects.equals(specieName[2], specieName[3]))
            {
                //System.out.print("CASE Y-B: ");
                //System.out.print(specie + " " + number + " " + male + " " + female + " " + immature + " " + imageID + "\n");

                if(immature > 0)
                {
                    number -= immature;
                    createVrstaTagSQL();
                    //1 layers deep tag
                    createTagIdSQL("vrsta", specieName[1]);
                    createMediaTagSQL(immature);
                    //2 layers deep tag
                    createTagIdSQL(specieName[1], specieName[4]);
                    createMediaTagSQL(immature);
                }

                if(number > 0)
                {
                    createVrstaTagSQL();
                    createTagIdSQL("vrsta", specieName[1]);
                    createMediaTagSQL(number);
                }
            }
            //CASE Y-C: male != female != immature
            else if(!Objects.equals(specieName[1], specieName[2]) && !Objects.equals(specieName[2], specieName[3]) && !Objects.equals(specieName[3], specieName[4]))
            {   
                //create for immatures
                if(immature > 0)
                {
                    number -= immature;
                    createVrstaTagSQL();
                    //1 layers deep tag
                    createTagIdSQL("vrsta", specieName[1]);
                    createMediaTagSQL(immature);
                    //2 layers deep tag
                    createTagIdSQL(specieName[1], specieName[4]);
                    createMediaTagSQL(immature);
                    
                }

                //create for female
                if(female > 0)
                {
                    number -= female;
                    createVrstaTagSQL();
                    //1 layers deep tag
                    createTagIdSQL("vrsta", specieName[1]);
                    createMediaTagSQL(female);
                    //2 layers deep tag
                    createTagIdSQL(specieName[1], specieName[3]);
                    createMediaTagSQL(female);
                }

                if(male > 0)
                {
                    number -= male;
                    createVrstaTagSQL();
                    //1 layers deep tag
                    createTagIdSQL("vrsta", specieName[1]);
                    createMediaTagSQL(male);
                    //2 layers deep ta
                    createTagIdSQL(specieName[1], specieName[2]);
                    createMediaTagSQL(male);
                }

                if(number > 0)
                {
                    createVrstaTagSQL();
                    createTagIdSQL("vrsta", specieName[1]);
                    createMediaTagSQL(number);
                }
            }
            //CASE Y-UNDEF: yet undefined tag behaviour inside CASE Y
            else
            {   
                //used for debbgging, in case I missed any possible tags
                System.out.print("CASE Y-UNDEF: ");
                System.out.print(specie + " " + number + " " + male + " " + female + " " + immature + " " + imageID + "\n");
            }
        }
    }

    //only debugging information is printed out
    public void printDebbugger(){
        String[] female = allFemale.toArray(new String[allFemale.size()]);
        String[] male = allMale.toArray(new String[allMale.size()]);
        String[] imma = allImmature.toArray(new String[allImmature.size()]);
        for(int i = 0; i < female.length; i ++) System.out.print(female[i] + ", ");
        System.out.println();
        for(int i = 0; i < male.length; i ++)   System.out.print(male[i] + ", ");
        System.out.println();
        for(int i = 0; i < imma.length; i ++)   System.out.print(imma[i] + ", ");
        System.out.println();
        for(int i = 0; i < speciesData.length; i ++) System.out.println(speciesData[i].toString());
        System.out.println();
    }

    //create media_tag connected to tag Vrsta for each species in Access database
    public void createVrstaTagSQL(){
        try {
            bw.write( "INSERT INTO media_tag (user_id, tag_id, media_id) "
                    + "VALUES (@userID, @speciesID, @mediaID);\n");
        }catch(Exception e){
            System.out.println("Could not write in SQL file at createVrstaTagSql");
            System.out.println(e.getMessage());
        }
    }

    //create media_tag INSERT INTO based on inputValue, @tagID, @mediaID
    public void createMediaTagSQL(int inputValue){
        try{
            bw.write( "INSERT INTO media_tag (user_id, tag_id, media_id, input_value) " 
                    + "VALUES (@userID, @tagID, @mediaID, " + inputValue + ");\n");
        }catch (Exception e){
            System.out.println("Could not write in SQL file at createMediaTagSQL");
            System.out.println(e.getMessage());
        }
    }

    //create SQL variable @tagID which saves the search tag_id for later inserting the tag inside the database
    public void createTagIdSQL(String broadParent, String tagName){
        try{
            bw.write( "SET @tagID =(SELECT child_id FROM(SELECT child_id, parent1, "
			        + "(SELECT parent_tag_id FROM tag WHERE tag.tag_id = parent1) AS parent2 "
                    + "FROM (SELECT tag_id AS child_id, parent_tag_id AS parent1 FROM tag WHERE name = '"
                    + tagName +"') AS tempTable) AS childTable WHERE (parent1 = '1' OR parent2 = '1') AND"
                    + "((SELECT name FROM tag WHERE tag.tag_id = parent1) = '" + broadParent
                    + "' OR (SELECT name FROM tag WHERE tag.tag_id = parent1) = 'vrsta'));\n");
        }catch(Exception e){
            System.out.println("Could not write in SQL file at createTagID");
            System.out.println(e.getMessage());
        }
    }

    //create SQL variable @mediaID which is used for saving different stuff to the media table over media_id
    public void createMediaIdSQL(String imagePath){
        try {
            bw.write( "SET @mediaID = (SELECT media_id FROM (SELECT media_id,"
                    + "CONCAT(value, name) AS imagePath FROM media, path WHERE "
                    + "media.path_id = path.path_id) AS tempTable WHERE imagePath = \"" 
                    + imagePath + "\");\n");
        }catch (Exception e) {
            System.out.println("Could not write in SQL file at CreateMediaIdSQL");
            System.out.println(e.getMessage());
        }
    }

    //create SQL variable @userID whish is used for saving the revievers user_id
    public void createUserIdSQL(String username){
        try{
            bw.write("SET @userID = (SELECT user_id FROM user WHERE username = \"" + username + "\");\n");
        }catch(Exception e) {
            System.out.println("Could not write in SQL file at CreateUserIdSQL");
            System.out.println(e.getMessage());
        }
    }

    public void createStaticSQL(){
        try{
            File xmlFile = new File(inputPath + "humanActivities.xml");
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(xmlFile);
            XPath xPath = XPathFactory.newInstance().newXPath();
            
            String humanActivity = ((Node)xPath.compile("/parent/translation").evaluate(doc, XPathConstants.NODE)).getTextContent();

            bw.write( "SET @speciesID = (SELECT tag_id FROM tag WHERE name = 'vrsta'); \n"
                    + "SET @activityID = (SELECT tag_id FROM tag WHERE name = '"+ humanActivity +"'); \n"
                    + "SET @carrionID = (SELECT tag.tag_id FROM tag, (SELECT tag_id, name FROM tag) "
                    + "AS temp WHERE tag.name = 'mrhovina' AND tag.parent_tag_id = temp.tag_id AND temp.name = 'vaba'); \n"
                    + "SET @baitID = (SELECT tag.tag_id FROM tag WHERE tag.name = 'vaba'); \n");
        }catch(Exception e){
            System.out.println("Error at writing staticSQL");
            System.out.println(e.getMessage());
        }
    }

    //create sql to update media.comment
    public void createCommentSQL(String comment){
        if (comment.length() == 0) return;
        try {
            bw.write("UPDATE media SET comment = \"" + comment + "\" WHERE media_id = @mediaID;\n");
        }catch(Exception e){
            System.out.println("Could not write in SQL file at createCommentSQL");
            System.out.println(e.getMessage());
        }
    } 
    
    //create sql to update media.interesting
    public void createInterestingSQL(){
        try {
            bw.write("UPDATE media SET interesting = 1 WHERE media_id = @mediaID;\n");
        }catch(Exception e){
            System.out.println("Could not write in SQL file at createInterestingSQL");
            System.out.println(e.getMessage());
        }
    }  

    //creates sql INSERT INTO media_tag for carrion, where  @carrionID is set at the start of the script
    public void createCarrionSQL(){
        try {   
            bw.write( "INSERT INTO media_tag (user_id, tag_id, media_id) "
                    + "VALUES (@userID, @baitID, @mediaID);\n");
            bw.write( "INSERT INTO media_tag (user_id, tag_id, media_id) " 
                    + "VALUES (@userID, @carrionID, @mediaID);\n");
        }catch(Exception e){
            System.out.println("Could not write in SQL file at createCarrionSQL");
            System.out.println(e.getMessage());
        }
    }

    public void createSqlByTagName() {

    }

    //tag for inserting human activity tag
    public void createHumanActivitySQL(String activity){
        String humanActivity = null;
        String tagName = null;
        try {
            File xmlFile = new File(inputPath + "humanActivities.xml");
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(xmlFile);
            XPath xPath = XPathFactory.newInstance().newXPath();
            
            humanActivity = ((Node)xPath.compile("/parent/translation").evaluate(doc, XPathConstants.NODE)).getTextContent();
            Node tagNode = ((Node)xPath.compile("/parent/activity[@key=\""+ activity +"\"]").evaluate(doc, XPathConstants.NODE));

            if(tagNode == null){
                //System.out.println("Unmapped activity: " + activity);
                return;
            }

            tagName = tagNode.getTextContent();
            bw.write( "SET @tagID = (SELECT tag.tag_id FROM tag, (SELECT tag_id, name FROM tag) AS temp "
                    + "WHERE temp.name = '" + humanActivity + "' AND tag.name = \"" 
                    + tagName + "\" AND tag.parent_tag_id = temp.tag_id);\n");
                    //activity tag
            bw.write( "INSERT INTO media_tag (user_id, tag_id, media_id) "
                    + "VALUES (@userID, @activityID, @mediaID);\n");
                    //activity.child tag
            bw.write( "INSERT INTO media_tag (user_id, tag_id, media_id) "
                    + "VALUES (@userID, @tagID, @mediaID);\n");
        }catch(Exception e){
            System.out.println("Could not write in SQL file at createHumanActivitySQL");
            e.printStackTrace();
            System.exit(0);
        }
    }

    //fill array of names(immature, female, male) with data classes
    public void createGenderData() throws Exception{
        BufferedReader gr = new BufferedReader(new InputStreamReader(new FileInputStream(inputPath + "genders.txt"), "utf8"));
        String line = gr.readLine();
        String[] data;

        for(int i = 0; i < speciesData.length; i ++) {
            data = line.split(" ");
            speciesData[i] = new GenderBySpecies(data[0], data[1], data[2], data[3], data[4]);
            line = gr.readLine();
        }

        System.out.println("Table of species created.");
        gr.close();
    }

    public int stringToInt(String string){
        if(string.length() != 0)
        {
            String num = string.split("\\.")[0];
            return Integer.parseInt(num);
        }
        return 0;
    }

    //function used for validating existing pictures
    public boolean valid(String path) {
        //modify by edditing rpelaceThis, picPath
        path = path.replaceAll("/", "\\\\");
        path = path.replace(replaceThis, picPath);
        return (new File(path).isFile() && !(new File(path).isDirectory()));
    }

    public void printStatistics() {
        System.out.println("\nNumber of found species:");
        for(int i = 0; i < numSpecies; i++)
        {
            System.out.printf("%s: %d \n", speciesData[i].specie, specieCount[i]);
        }
    }

    //returns String array with male, female, immature data
    public String[] findSpecieNames(String specie){
        for(int i = 0; i < speciesData.length; i ++){
            if(speciesData[i].check(specie)) {
                //iSpecie for statistics
                iSpecie = i;    
                return speciesData[i].getNames();
            }
        }
        System.out.println("Specie <" + specie + "> not found. Line ID: " + imageID + "\n This might result in a problem, when inserting SQL data");
        return null;
    }

    public static void main(String[] args){
        Data2MySQL d2s = null;
        try {
            if(args.length == 1){
                if(Objects.equals(args[0], "-validate")) d2s = new Data2MySQL(true);
                else {
                    System.out.println("Unknown command, only one possible is -validate");
                    System.exit(0);
                }
            }
            else d2s = new Data2MySQL();
            d2s.printSystemSettings();
            d2s.createSQL();
            //d2s.printStatistics();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}

class GenderBySpecies {
    public String specie;
    public String general;
    public String male;
    public String female;
    public String immature;

    public GenderBySpecies (String specie, String general, 
                            String male,  String female, 
                            String immature) {
        this.specie   = specie;
        this.general  = general;
        this.male     = male;
        this.female   = female;
        this.immature = immature;
    }

    public String[] getNames(){
        return new String[] {specie, general, male, female, immature};
    }

    public boolean check(String specie){
        return (Objects.equals(this.specie, specie));
    }

    public String toString(){
        return specie + " " + general + " " + male + " " + female + " " + immature;
    }
}