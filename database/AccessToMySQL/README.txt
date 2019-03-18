<datoteke se nahajajo v mapi "izhodne">
Priporocen postopek vstavljanja podatkov v tabele MySql baze:
------------------------------------------------------
<<korak>.Tabela (<vhodnaDatoteka>.txt)>
1.Path (Image_name_koca_path)
2.Site (Image_name_koca_site)

3.media (Image_name_koca_media)
////
-> za pomoc ti bom podal to kodo za SQL query (sem nasel enega preprostega)

INSERT INTO `media` (`date`, `name`, `empty`, image, interesting, `comment`, site_id, path_id)
VALUES ("20171603", "IMAG0001.JPG", "0", "1", "1", "null", (SELECT site_id FROM site WHERE `name` = "17_Janezova_koca"), (SELECT path_id FROM path WHERE `value` = "parsani podatki poti do slike"))

->trenutno bomo obdrzali empty, image ter interesting kot konstanto, prav tako pa komentarje, dokler ne pridem do te tocke parsanja podatkov iz Accessa... (kar je povsej verjetnoti vzrok za javljanje ponavljajocih podatkov pri vstavljanju v MySQL)
-> *"parsani podatki poti do slike" - pot do datoteke ki bos imel podano v failu
   *"17_Janezova_koca" - tudi podatek ki ga bos najdel s parsanjem mojih failov
////

------------------------------------------------------
Legenda:
Image_name_koca_path.txt -> vse različne poti do map, slik
Image_name_koca_site.txt -> vsa različna krmišča (trenutno samo eno)
Image_name_koca_media.txt -> podatki za tabelo media, v MySQL (trenutno, se par podatkov ponavlja)
Data_base_koca.txt	  -> podatki o razlicnih tagah (potrebno prevesti v datoteko za MySQL)		  