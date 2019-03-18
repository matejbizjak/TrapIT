import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.io.File;

//PROGRAM KONCAN
//branje iz "media_name_koca_valid" -> "media_name_koca_path_redundant" izhod pa so poti do vsake slike,
//potreben dodaten program da nardi ne ponavlajajoce poti do slik

class Image_name2path_p1 {
    public static String inputPath = "." + File.separator + "vhodne" + File.separator;
    public static String outputPath = "." + File.separator + "izhodne" + File.separator;
    public static String input = "Image_name_koca_valid.txt";
    public static String output = "Image_name_koca_path_redundant.txt";

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(inputPath + input));
        BufferedWriter bw = new BufferedWriter(new FileWriter(outputPath + output));
        String[] lineSplit;
        String path;
        String line = br.readLine();
        
        while (line != null) {
            lineSplit = line.split(",");
            lineSplit = lineSplit[1].split("/");
            lineSplit[lineSplit.length - 1] = "";
            path = String.join("/", lineSplit);
            bw.write(path);
            bw.newLine();
            line = br.readLine();
        }
        bw.close();
        br.close();
    }
}