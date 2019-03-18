import java.io.FileOutputStream;
import java.util.Properties;

public class SetSettings {
    public static void main(String[] args) {

        String dbCreationScriptFileName = "TrapIT_4.sql";
        String mediaTableSourceFileName = "Image_name_koca_media.txt";
        String pathTableSourceFileName = "Image_name_koca_path.txt";
        String siteTableSourceFileName = "Image_name_koca_site.txt";
        String roleUserProjectScriptFileName = "RoleUserProject.sql";
        String tagTableSourceFile = "tags_2_2.txt";

        try {
            Properties settings = new Properties();

            settings.setProperty("url", "jdbc:mysql://127.0.0.1:3306/?useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&useSSL=false");
            settings.setProperty("username", "root");
            settings.setProperty("password", "password");

            settings.setProperty("dbCreationScript", dbCreationScriptFileName);

            settings.setProperty("mediaDataFile", mediaTableSourceFileName);
            settings.setProperty("pathDataFile", pathTableSourceFileName);
            settings.setProperty("siteDataFile", siteTableSourceFileName);

            settings.setProperty("roleUserProjectScript", roleUserProjectScriptFileName);

            settings.setProperty("tagDataFile", tagTableSourceFile);

            settings.storeToXML(new FileOutputStream("settings.xml"), "");
        } catch(Exception e) {

        }

    }
}