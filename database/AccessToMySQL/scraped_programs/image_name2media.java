import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.io.File;
import java.util.Objects;

// program prevede "Image_name_koca_valid" -> "Image_name_koca_image" tako da so podatki v izdelani datoteki
// pripravljeni za vstavljanje v MySql tabelo Media

class Image_name2media{
    public static String inputPath = "." + File.separator + "vhodne" + File.separator;
    public static String outputPath = "." + File.separator + "izhodne" + File.separator;
    public static String input = "Image_name_koca_valid.txt";
    public static String output = "Image_name_koca_media.txt";

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(inputPath + input));
        BufferedWriter bw = new BufferedWriter(new FileWriter(outputPath + output));
        String[] lineSplit;
        String[] temp;
        String date, time, datetime, name, empty, image, interesting, comment, site, path;
        String line = br.readLine();
        
        while (line != null) {
            lineSplit = line.split(",");
            //// DATETIME
            date = lineSplit[4];
            temp = date.split(" ");
            date = temp[0];

            time = lineSplit[5];
            temp = time.split(" ");
            time = temp[1];

            datetime = date + " " + time;
            //// NAME
            name = lineSplit[6];
            //// EMPTY TODO
            empty = "0";
            //// IMAGE
            if(Objects.equals(lineSplit[6], "JPG") || Objects.equals(lineSplit[6], "PNG")) image = "1";
            else image = "0";
            /// INTERESTING TODO
            interesting = "1";
            /// COMMENT TODO
            comment = "komentar";
            /// SITE
            site = lineSplit[3];
            /// PATH 
            lineSplit = lineSplit[1].split("/");
            lineSplit[lineSplit.length - 1] = "";
            path = String.join("/", lineSplit);

            line = datetime + "," + name + "," + empty + "," + image + "," + interesting + "," + comment + "," + site + "," + path;
            bw.write(line);
            bw.newLine();
            line = br.readLine();
        }
        bw.close();
        br.close();
    }
}