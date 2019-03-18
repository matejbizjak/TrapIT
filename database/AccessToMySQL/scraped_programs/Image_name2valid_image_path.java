import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;
import java.io.File;

//KONCAN PROGRAM
//branje iz "media_name_koca" -> "media_name_koca_valid"izhod pa so vse validne slike ki jih imamo na trdem disku
//"media_name_koca" -> +redundant

class Image_name2valid_image_path {
    public static String inputPath = "." + File.separator + "vhodne" + File.separator;
    public static String outputPath = "." + File.separator + "izhodne" + File.separator;
    public static String input = "Image_name_koca.txt";
    public static String output = "Image_name_koca_valid.txt";

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(inputPath + input));
        BufferedWriter bw = new BufferedWriter(new FileWriter(outputPath + output));
        String[] lineSplit;
        String line = br.readLine();

        int i = 0;
        while (line != null) {
            lineSplit = line.split(",");
            if (valid(lineSplit[1])) {
                bw.write(line);
                bw.newLine();
                i ++;
            }
            line = br.readLine();
        }
        System.out.printf("Stevilo slik na disku: %d \n", i);
        bw.close();
        br.close();
    }

    // ta funkcija deluje le ce imas direktorij kjer so slike nastavljen na D:PKP\*
    public static String potDoSlik = "D:\\PKP\\";

    public static boolean valid(String path) {
        path = path.replaceAll("/", "\\\\");
        path = path.replace("V:\\2017\\", potDoSlik);
        return (new File(path).isFile() && !(new File(path).isDirectory()));
    }
}