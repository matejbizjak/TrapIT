import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.io.File;

//branje iz "Data_base" -> "Data_base2Data_base_koca" izhod pa so poti do vsake slike,
//potreben dodaten program da nardi ne ponavlajajoce poti do slik

class Data_base2Data_base_koca {
    public static String inputPath = "." + File.separator + "vhodne" + File.separator;
    public static String outputPath = "." + File.separator + "izhodne" + File.separator;
    public static String input = "Data_base.txt";
    public static String output = "Data_base_koca.txt";

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(inputPath + input));
        BufferedWriter bw = new BufferedWriter(new FileWriter(outputPath + output));
        String[] lineSplit;
        String path;
        String line = br.readLine();
        
        int i = 0;
        while (line != null) {
            lineSplit = line.split(",");
            path = lineSplit[4];
            if(path.startsWith("V:/2017/17_Janezova_koca/")){
                bw.write(line);
                bw.newLine();
                i ++;
                System.out.printf("%s  %d\n", path, i);
            }
            line = br.readLine();
        }
        bw.close();
        br.close();
    }
}