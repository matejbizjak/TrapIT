import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.io.File;
import java.util.Objects;

//PROGRAM KONCAN
//branje iz "media_name_koca_path_redundant" -> "media_name_koca_path" izhod pa so poti do vsake slike,
//ne ponavlajajoce se poti

class Image_name2path_p2{
    public static String inputPath = "." + File.separator + "vhodne" + File.separator;
    public static String outputPath = "." + File.separator + "izhodne" + File.separator;
    public static String input = "Image_name_koca_path_redundant.txt";
    public static String output = "Image_name_koca_path.txt";
    public static String[] tabela = new String[100];

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(inputPath + input));
        BufferedWriter bw = new BufferedWriter(new FileWriter(outputPath + output));
        String line = br.readLine();
        
        while (line != null) {
            if(!included(line)){
                bw.write(line);
                bw.newLine();
            }
            line = br.readLine();
        }
        bw.close();
        br.close();
    }

    public static boolean included(String path){
        int i = 0;
        while(tabela[i] != null){
            if(Objects.equals(tabela[i], path)){
                return true;
            }
            i ++;
        }
        tabela[i] = path;
        return false;
    }
}