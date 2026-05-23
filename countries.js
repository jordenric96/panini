// countries.js - Complete Database WK 2026 (980 Stickers met Namen)

const collections = [
    { 
        prefix: 'FWC', name: 'FIFA World Cup', count: 20, 
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Logo_de_la_Copa_Mundial_de_f%C3%BAtbol_2026.svg/200px-Logo_de_la_Copa_Mundial_de_f%C3%BAtbol_2026.svg.png', 
        colors: ['#4f46e5', '#ff005b'], group: 'Introductie',
        players: ["Panini Logo (00)", "Official Emblem 1", "Official Emblem 2", "Official Mascots", "Official Slogan", "Official Match Ball", "Host Canada", "Host Mexico", "Host USA", "Stadium 1", "Stadium 2", "Stadium 3", "Stadium 4", "Stadium 5", "Stadium 6", "Stadium 7", "Stadium 8", "World Cup Trophy 1", "World Cup Trophy 2", "FIFA Legends"] 
    },
    
    // POULE A
    { 
        prefix: 'MEX', name: 'Mexico', count: 20, flagUrl: 'https://flagcdn.com/w160/mx.png', colors: ['#006847', '#CE1126'], group: 'Poule A',
        players: ["Team Logo (Foil)", "Guillermo Ochoa", "Cesar Montes", "Johan Vasquez", "Jorge Sanchez", "Jesus Gallardo", "Edson Alvarez", "Luis Chavez", "Orbelin Pineda", "Hirving Lozano", "Santiago Gimenez", "Uriel Antuna", "Teamfoto (MEX)", "Luis Malagon", "Kevin Alvarez", "Erick Sanchez", "Roberto Alvarado", "Henry Martin", "Julian Quinones", "Raul Jimenez"] 
    },
    { 
        prefix: 'RSA', name: 'Zuid-Afrika', count: 20, flagUrl: 'https://flagcdn.com/w160/za.png', colors: ['#007749', '#FFB81C'], group: 'Poule A',
        players: ["Team Logo (Foil)", "Ronwen Williams", "Khuliso Mudau", "Mothobi Mvala", "Siyanda Xulu", "Aubrey Modiba", "Teboho Mokoena", "Sphephelo Sithole", "Themba Zwane", "Percy Tau", "Zakhele Lepasa", "Evidence Makgopa", "Teamfoto (RSA)", "Veli Mothwa", "Grant Kekana", "Thapelo Morena", "Thabang Monare", "Mihlali Mayambela", "Oswin Appollis", "Lyle Foster"] 
    },
    { 
        prefix: 'KOR', name: 'Zuid-Korea', count: 20, flagUrl: 'https://flagcdn.com/w160/kr.png', colors: ['#CD2E3A', '#0047A0'], group: 'Poule A',
        players: ["Team Logo (Foil)", "Kim Seung-gyu", "Kim Min-jae", "Jung Seung-hyun", "Seol Young-woo", "Lee Ki-je", "Hwang In-beom", "Park Yong-woo", "Lee Kang-in", "Son Heung-min", "Hwang Hee-chan", "Cho Gue-sung", "Teamfoto (KOR)", "Jo Hyeon-woo", "Kim Young-gwon", "Kim Tae-hwan", "Hong Hyun-seok", "Lee Jae-sung", "Jeong Woo-yeong", "Oh Hyeon-gyu"] 
    },
    { 
        prefix: 'CZE', name: 'Tsjechië', count: 20, flagUrl: 'https://flagcdn.com/w160/cz.png', colors: ['#D7141A', '#11457E'], group: 'Poule A',
        players: ["Team Logo (Foil)", "Jindrich Stanek", "Tomas Holes", "Robin Hranac", "Ladislav Krejci", "Vladimir Coufal", "David Doudera", "Tomas Soucek", "Lukas Provod", "Antonin Barak", "Patrik Schick", "Adam Hlozek", "Teamfoto (CZE)", "Matej Kovar", "David Zima", "Tomas Vlcek", "Pavel Sulc", "Mojmir Chytil", "Jan Kuchta", "Tomas Chory"] 
    },

    // POULE B
    { 
        prefix: 'CAN', name: 'Canada', count: 20, flagUrl: 'https://flagcdn.com/w160/ca.png', colors: ['#FF0000', '#444444'], group: 'Poule B',
        players: ["Team Logo (Foil)", "Maxime Crepeau", "Alistair Johnston", "Moise Bombito", "Derek Cornelius", "Alphonso Davies", "Tajon Buchanan", "Stephen Eustaquio", "Ismael Kone", "Jonathan David", "Cyle Larin", "Liam Millar", "Teamfoto (CAN)", "Dayne St. Clair", "Kamal Miller", "Richie Laryea", "Samuel Piette", "Mathieu Choiniere", "Jacob Shaffelburg", "Ike Ugbo"] 
    },
    { 
        prefix: 'BIH', name: 'Bosnië en Her.', count: 20, flagUrl: 'https://flagcdn.com/w160/ba.png', colors: ['#002395', '#FECB00'], group: 'Poule B',
        players: ["Team Logo (Foil)", "Ibrahim Sehic", "Anel Ahmedhodzic", "Dennis Hadzikadunic", "Sead Kolasinac", "Amar Dedic", "Jusuf Gazibegovic", "Rade Krunic", "Amir Hadziahmetovic", "Edin Dzeko", "Ermedin Demirovic", "Smail Prevljak", "Teamfoto (BIH)", "Kenan Piric", "Adrian Leon Barisic", "Gojko Cimirot", "Benjamin Tahirovic", "Miroslav Stevanovic", "Luka Menalo", "Haris Tabakovic"] 
    },
    { 
        prefix: 'QAT', name: 'Qatar', count: 20, flagUrl: 'https://flagcdn.com/w160/qa.png', colors: ['#8A1538', '#666666'], group: 'Poule B',
        players: ["Team Logo (Foil)", "Meshaal Barsham", "Pedro Miguel", "Almahdi Ali", "Lucas Mendes", "Mohammed Waad", "Tarek Salman", "Jassem Gaber", "Hassan Al-Haydos", "Akram Afif", "Almoez Ali", "Yusuf Abdurisag", "Teamfoto (QAT)", "Saad Al-Sheeb", "Boualem Khoukhi", "Homam Ahmed", "Abdulaziz Hatem", "Ali Asad", "Ahmed Alaaeldin", "Ismaeel Mohammad"] 
    },
    { 
        prefix: 'SUI', name: 'Zwitserland', count: 20, flagUrl: 'https://flagcdn.com/w160/ch.png', colors: ['#FF0000', '#333333'], group: 'Poule B',
        players: ["Team Logo (Foil)", "Yann Sommer", "Manuel Akanji", "Nico Elvedi", "Ricardo Rodriguez", "Silvan Widmer", "Remo Freuler", "Granit Xhaka", "Dan Ndoye", "Xherdan Shaqiri", "Ruben Vargas", "Breel Embolo", "Teamfoto (SUI)", "Gregor Kobel", "Fabian Schar", "Leonidas Stergiou", "Denis Zakaria", "Michel Aebischer", "Zeki Amdouni", "Kwadwo Duah"] 
    },

    // POULE C
    { 
        prefix: 'BRA', name: 'Brazilië', count: 20, flagUrl: 'https://flagcdn.com/w160/br.png', colors: ['#009739', '#FFDF00'], group: 'Poule C',
        players: ["Team Logo (Foil)", "Alisson Becker", "Danilo", "Marquinhos", "Gabriel Magalhaes", "Wendell", "Bruno Guimaraes", "Lucas Paqueta", "Joao Gomes", "Raphinha", "Rodrygo", "Vinicius Junior", "Teamfoto (BRA)", "Ederson", "Eder Militao", "Beraldo", "Douglas Luiz", "Andreas Pereira", "Gabriel Martinelli", "Endrick"] 
    },
    { 
        prefix: 'MAR', name: 'Marokko', count: 20, flagUrl: 'https://flagcdn.com/w160/ma.png', colors: ['#C1272D', '#006233'], group: 'Poule C',
        players: ["Team Logo (Foil)", "Yassine Bounou", "Achraf Hakimi", "Nayef Aguerd", "Romain Saiss", "Noussair Mazraoui", "Sofyan Amrabat", "Azzedine Ounahi", "Hakim Ziyech", "Brahim Diaz", "Amine Adli", "Youssef En-Nesyri", "Teamfoto (MAR)", "Munir El Kajoui", "Chadi Riad", "Yahya Attiat-Allah", "Amir Richardson", "Ismael Saibari", "Eliesse Ben Seghir", "Ayoub El Kaabi"] 
    },
    { 
        prefix: 'HAI', name: 'Haïti', count: 20, flagUrl: 'https://flagcdn.com/w160/ht.png', colors: ['#D21034', '#00205B'], group: 'Poule C',
        players: ["Team Logo (Foil)", "Johny Placide", "Carlens Arcus", "Ricardo Ade", "Mechack Jerome", "Alex Christian", "Bryan Alceus", "Carl Fredrick Sainte", "Derrick Etienne Jr", "Danley Jean Jacques", "Duckens Nazon", "Frantzdy Pierrot", "Teamfoto (HAI)", "Garissone Innocent", "Garven Metusala", "Francois Dulysse", "Steven Saba", "Fabrice Picault", "Mondy Prunier", "Louicius Don Deedson"] 
    },
    { 
        prefix: 'SCO', name: 'Schotland', count: 20, flagUrl: 'https://flagcdn.com/w160/gb-sct.png', colors: ['#005EB8', '#FFFFFF'], group: 'Poule C',
        players: ["Team Logo (Foil)", "Angus Gunn", "Jack Hendry", "Grant Hanley", "Kieran Tierney", "Anthony Ralston", "Andrew Robertson", "Callum McGregor", "Billy Gilmour", "Scott McTominay", "John McGinn", "Che Adams", "Teamfoto (SCO)", "Craig Gordon", "Ryan Porteous", "Scott McKenna", "Ryan Christie", "Stuart Armstrong", "James Forrest", "Lawrence Shankland"] 
    },

    // POULE D
    { 
        prefix: 'USA', name: 'Verenigde Staten', count: 20, flagUrl: 'https://flagcdn.com/w160/us.png', colors: ['#B22234', '#3C3B6E'], group: 'Poule D',
        players: ["Team Logo (Foil)", "Matt Turner", "Sergino Dest", "Chris Richards", "Tim Ream", "Antonee Robinson", "Tyler Adams", "Weston McKennie", "Yunus Musah", "Christian Pulisic", "Timothy Weah", "Folarin Balogun", "Teamfoto (USA)", "Ethan Horvath", "Miles Robinson", "Joe Scally", "Giovanni Reyna", "Malik Tillman", "Ricardo Pepi", "Josh Sargent"] 
    },
    { 
        prefix: 'PAR', name: 'Paraguay', count: 20, flagUrl: 'https://flagcdn.com/w160/py.png', colors: ['#D52B1E', '#0038A8'], group: 'Poule D',
        players: ["Team Logo (Foil)", "Carlos Coronel", "Robert Rojas", "Gustavo Gomez", "Fabian Balbuena", "Junior Alonso", "Mathias Villasanti", "Andres Cubas", "Diego Gomez", "Miguel Almiron", "Julio Enciso", "Ramon Sosa", "Teamfoto (PAR)", "Antony Silva", "Omar Alderete", "Matias Espinoza", "Richard Sanchez", "Matias Rojas", "Adam Bareiro", "Antonio Sanabria"] 
    },
    { 
        prefix: 'AUS', name: 'Australië', count: 20, flagUrl: 'https://flagcdn.com/w160/au.png', colors: ['#FFCD00', '#008751'], group: 'Poule D',
        players: ["Team Logo (Foil)", "Mathew Ryan", "Nathaniel Atkinson", "Harry Souttar", "Kye Rowles", "Aziz Behich", "Keanu Baccus", "Jackson Irvine", "Connor Metcalfe", "Craig Goodwin", "Martin Boyle", "Mitchell Duke", "Teamfoto (AUS)", "Joe Gauci", "Cameron Burgess", "Jordan Bos", "Riley McGree", "Massimo Luongo", "Sam Silvera", "Kusini Yengi"] 
    },
    { 
        prefix: 'TUR', name: 'Turkije', count: 20, flagUrl: 'https://flagcdn.com/w160/tr.png', colors: ['#E30A17', '#222222'], group: 'Poule D',
        players: ["Team Logo (Foil)", "Mert Gunok", "Zeki Celik", "Merih Demiral", "Abdulkerim Bardakci", "Ferdi Kadioglu", "Hakan Calhanoglu", "Salih Ozcan", "Orkun Kokcu", "Arda Guler", "Kenan Yildiz", "Baris Alper Yilmaz", "Teamfoto (TUR)", "Ugurcan Cakir", "Ozan Kabak", "Cenk Ozkacar", "Ismail Yuksek", "Kerem Akturkoglu", "Irfan Can Kahveci", "Cenk Tosun"] 
    },

    // POULE E
    { 
        prefix: 'GER', name: 'Duitsland', count: 20, flagUrl: 'https://flagcdn.com/w160/de.png', colors: ['#222222', '#FFCE00'], group: 'Poule E',
        players: ["Team Logo (Foil)", "Marc-Andre ter Stegen", "Joshua Kimmich", "Antonio Rudiger", "Jonathan Tah", "Maximilian Mittelstadt", "Robert Andrich", "Pascal Gross", "Ilkay Gundogan", "Florian Wirtz", "Jamal Musiala", "Kai Havertz", "Teamfoto (GER)", "Manuel Neuer", "Nico Schlotterbeck", "David Raum", "Aleksandar Pavlovic", "Leroy Sane", "Niclas Fullkrug", "Deniz Undav"] 
    },
    { 
        prefix: 'CUW', name: 'Curaçao', count: 20, flagUrl: 'https://flagcdn.com/w160/cw.png', colors: ['#002B7F', '#F9E814'], group: 'Poule E',
        players: ["Team Logo (Foil)", "Eloy Room", "Cuco Martina", "Jurien Gaari", "Roshon van Eijma", "Sherel Floranus", "Vurnon Anita", "Leandro Bacuna", "Juninho Bacuna", "Brandley Kuwas", "Kenji Gorre", "Rangelo Janga", "Teamfoto (CUW)", "Trevor Doornbusch", "Juriensley Martina", "Nathaniel Markelo", "Kevin Felida", "Godfried Roemeratoe", "Jeremy Antonisse", "Jurgen Locadia"] 
    },
    { 
        prefix: 'CIV', name: 'Ivoorkust', count: 20, flagUrl: 'https://flagcdn.com/w160/ci.png', colors: ['#F77F00', '#009E60'], group: 'Poule E',
        players: ["Team Logo (Foil)", "Yahia Fofana", "Serge Aurier", "Evan Ndicka", "Odilon Kossounou", "Ghislain Konan", "Ibrahim Sangare", "Franck Kessie", "Seko Fofana", "Simon Adingra", "Nicolas Pepe", "Sebastien Haller", "Teamfoto (CIV)", "Badra Ali Sangare", "Ousmane Diomande", "Wilfried Singo", "Jean Michael Seri", "Jeremie Boga", "Christian Kouame", "Oumar Diakite"] 
    },
    { 
        prefix: 'ECU', name: 'Ecuador', count: 20, flagUrl: 'https://flagcdn.com/w160/ec.png', colors: ['#FFD100', '#00205B'], group: 'Poule E',
        players: ["Team Logo (Foil)", "Hernan Galindez", "Angelo Preciado", "Felix Torres", "Willian Pacho", "Piero Hincapie", "Moises Caicedo", "Carlos Gruezo", "Kendry Paez", "Gonzalo Plata", "Jeremy Sarmiento", "Enner Valencia", "Teamfoto (ECU)", "Alexander Dominguez", "Jackson Porozo", "Pervis Estupinan", "Jose Cifuentes", "Alan Franco", "Angel Mena", "Kevin Rodriguez"] 
    },

    // POULE F
    { 
        prefix: 'NED', name: 'Nederland', count: 20, flagUrl: 'https://flagcdn.com/w160/nl.png', colors: ['#F36C21', '#21468B'], group: 'Poule F',
        players: ["Team Logo (Foil)", "Bart Verbruggen", "Virgil van Dijk", "Nathan Aké", "Denzel Dumfries", "Matthijs de Ligt", "Stefan de Vrij", "Jeremie Frimpong", "Frenkie de Jong", "Tijjani Reijnders", "Xavi Simons", "Cody Gakpo", "Teamfoto (NED)", "Mark Flekken", "Micky van de Ven", "Ian Maatsen", "Joey Veerman", "Donyell Malen", "Wout Weghorst", "Memphis Depay"]
    },
    { 
        prefix: 'JPN', name: 'Japan', count: 20, flagUrl: 'https://flagcdn.com/w160/jp.png', colors: ['#000555', '#BC002D'], group: 'Poule F',
        players: ["Team Logo (Foil)", "Zion Suzuki", "Yukinari Sugawara", "Ko Itakura", "Takehiro Tomiyasu", "Hiroki Ito", "Wataru Endo", "Hidemasa Morita", "Takefusa Kubo", "Junya Ito", "Kaoru Mitoma", "Ayase Ueda", "Teamfoto (JPN)", "Keisuke Osako", "Shogo Taniguchi", "Koki Machida", "Ao Tanaka", "Daichi Kamada", "Takumi Minamino", "Takuma Asano"] 
    },
    { 
        prefix: 'SWE', name: 'Zweden', count: 20, flagUrl: 'https://flagcdn.com/w160/se.png', colors: ['#004B87', '#FFCD00'], group: 'Poule F',
        players: ["Team Logo (Foil)", "Robin Olsen", "Emil Krafth", "Victor Lindelof", "Isak Hien", "Ludwig Augustinsson", "Mattias Svanberg", "Jens Cajuste", "Dejan Kulusevski", "Emil Forsberg", "Viktor Gyokeres", "Alexander Isak", "Teamfoto (SWE)", "Viktor Johansson", "Carl Starfelt", "Linus Wahlqvist", "Hugo Larsson", "Anton Saletros", "Jesper Karlsson", "Anthony Elanga"] 
    },
    { 
        prefix: 'TUN', name: 'Tunesië', count: 20, flagUrl: 'https://flagcdn.com/w160/tn.png', colors: ['#E70013', '#444444'], group: 'Poule F',
        players: ["Team Logo (Foil)", "Aymen Dahmen", "Wajdi Kechrida", "Montassar Talbi", "Yassine Meriah", "Ali Abdi", "Ellyes Skhiri", "Aissa Laidouni", "Hannibal Mejbri", "Youssef Msakni", "Elias Achouri", "Seifeddine Jaziri", "Teamfoto (TUN)", "Bechir Ben Said", "Dylan Bronn", "Oussama Haddadi", "Mohamed Ali Ben Romdhane", "Hamza Rafia", "Naim Sliti", "Haythem Jouini"] 
    },

    // POULE G
    { 
        prefix: 'BEL', name: 'België', count: 20, flagUrl: 'https://flagcdn.com/w160/be.png', colors: ['#ED2939', '#FDDA24'], group: 'Poule G',
        players: ["Team Logo (Foil)", "Thibaut Courtois", "Arthur Theate", "Timothy Castagne", "Zeno Debast", "Wout Faes", "Axel Witsel", "Thomas Meunier", "Amadou Onana", "Orel Mangala", "Kevin De Bruyne", "Romelu Lukaku", "Teamfoto (BEL)", "Koen Casteels", "Jan Vertonghen", "Youri Tielemans", "Jeremy Doku", "Leandro Trossard", "Johan Bakayoko", "Lois Openda"]
    },
    { 
        prefix: 'EGY', name: 'Egypte', count: 20, flagUrl: 'https://flagcdn.com/w160/eg.png', colors: ['#CE1126', '#111111'], group: 'Poule G',
        players: ["Team Logo (Foil)", "Mohamed El Shenawy", "Mohamed Hany", "Mohamed Abdelmonem", "Ahmed Hegazi", "Mohamed Hamdi", "Marwan Attia", "Emam Ashour", "Zizo", "Mohamed Salah", "Trezeguet", "Mostafa Mohamed", "Teamfoto (EGY)", "Gabaski", "Ali Gabr", "Omar Kamal", "Hamdi Fathi", "Mohamed Elneny", "Omar Marmoush", "Mahmoud Kahraba"] 
    },
    { 
        prefix: 'IRN', name: 'Iran', count: 20, flagUrl: 'https://flagcdn.com/w160/ir.png', colors: ['#239F40', '#DA0000'], group: 'Poule G',
        players: ["Team Logo (Foil)", "Alireza Beiranvand", "Ramin Rezaeian", "Hossein Kanaanizadegan", "Shojae Khalilzadeh", "Ehsan Hajsafi", "Saeid Ezatolahi", "Saman Ghoddos", "Alireza Jahanbakhsh", "Mehdi Torabi", "Sardar Azmoun", "Mehdi Taremi", "Teamfoto (IRN)", "Hossein Hosseini", "Majid Hosseini", "Milad Mohammadi", "Rouzbeh Cheshmi", "Omid Ebrahimi", "Ali Gholizadeh", "Karim Ansarifard"] 
    },
    { 
        prefix: 'NZL', name: 'Nieuw-Zeeland', count: 20, flagUrl: 'https://flagcdn.com/w160/nz.png', colors: ['#111111', '#888888'], group: 'Poule G',
        players: ["Team Logo (Foil)", "Max Crocombe", "Tim Payne", "Michael Boxall", "Nando Pijnaker", "Liberato Cacace", "Joe Bell", "Marko Stamenic", "Matthew Garbett", "Callum McCowatt", "Elijah Just", "Chris Wood", "Teamfoto (NZL)", "Oliver Sail", "Tommy Smith", "Tyler Bindon", "Sarpreet Singh", "Alex Rufer", "Kosta Barbarouses", "Ben Waine"] 
    },

    // POULE H
    { 
        prefix: 'ESP', name: 'Spanje', count: 20, flagUrl: 'https://flagcdn.com/w160/es.png', colors: ['#AA151B', '#F1BF00'], group: 'Poule H',
        players: ["Team Logo (Foil)", "Unai Simon", "Dani Carvajal", "Robin Le Normand", "Aymeric Laporte", "Alejandro Grimaldo", "Rodri", "Fabian Ruiz", "Pedri", "Lamine Yamal", "Nico Williams", "Alvaro Morata", "Teamfoto (ESP)", "David Raya", "Nacho", "Marc Cucurella", "Mikel Merino", "Dani Olmo", "Ferran Torres", "Joselu"] 
    },
    { 
        prefix: 'CPV', name: 'Kaapverdië', count: 20, flagUrl: 'https://flagcdn.com/w160/cv.png', colors: ['#003893', '#CF2027'], group: 'Poule H',
        players: ["Team Logo (Foil)", "Vozinha", "Steven Moreira", "Roberto Lopes", "Logan Costa", "Joao Paulo", "Kevin Pina", "Jamiro Monteiro", "Deroy Duarte", "Garry Rodrigues", "Ryan Mendes", "Bebe", "Teamfoto (CPV)", "Marcio Rosa", "Diney Borges", "Dylan Tavares", "Patrick Andrade", "Kenny Rocha", "Willy Semedo", "Gilson Tavares"] 
    },
    { 
        prefix: 'KSA', name: 'Saoedi-Arabië', count: 20, flagUrl: 'https://flagcdn.com/w160/sa.png', colors: ['#006C35', '#D4AF37'], group: 'Poule H',
        players: ["Team Logo (Foil)", "Mohammed Al-Owais", "Saud Abdulhamid", "Ali Al-Bulaihi", "Hassan Tambakti", "Yasser Al-Shahrani", "Mohamed Kanno", "Sami Al-Najei", "Salman Al-Faraj", "Salem Al-Dawsari", "Abdulrahman Ghareeb", "Firas Al-Buraikan", "Teamfoto (KSA)", "Nawaf Al-Aqidi", "Abdulelah Al-Amri", "Sultan Al-Ghannam", "Mukhtar Ali", "Faisal Al-Ghamdi", "Ayman Yahya", "Saleh Al-Shehri"] 
    },
    { 
        prefix: 'URU', name: 'Uruguay', count: 20, flagUrl: 'https://flagcdn.com/w160/uy.png', colors: ['#0081C8', '#FCD116'], group: 'Poule H',
        players: ["Team Logo (Foil)", "Sergio Rochet", "Nahitan Nandez", "Ronald Araujo", "Jose Maria Gimenez", "Mathias Olivera", "Manuel Ugarte", "Federico Valverde", "Nicolas de la Cruz", "Facundo Pellistri", "Maximiliano Araujo", "Darwin Nunez", "Teamfoto (URU)", "Santiago Mele", "Sebastian Caceres", "Matias Vina", "Rodrigo Bentancur", "Giorgian de Arrascaeta", "Brian Rodriguez", "Luis Suarez"] 
    },

    // POULE I
    { 
        prefix: 'FRA', name: 'Frankrijk', count: 20, flagUrl: 'https://flagcdn.com/w160/fr.png', colors: ['#002395', '#ED2939'], group: 'Poule I',
        players: ["Team Logo (Foil)", "Mike Maignan", "Jules Kounde", "William Saliba", "Dayot Upamecano", "Theo Hernandez", "N'Golo Kante", "Aurelien Tchouameni", "Adrien Rabiot", "Antoine Griezmann", "Ousmane Dembele", "Kylian Mbappe", "Teamfoto (FRA)", "Alphonse Areola", "Ibrahima Konate", "Jonathan Clauss", "Eduardo Camavinga", "Warren Zaire-Emery", "Marcus Thuram", "Olivier Giroud"] 
    },
    { 
        prefix: 'SEN', name: 'Senegal', count: 20, flagUrl: 'https://flagcdn.com/w160/sn.png', colors: ['#00853F', '#FDEF42'], group: 'Poule I',
        players: ["Team Logo (Foil)", "Edouard Mendy", "Krepin Diatta", "Kalidou Koulibaly", "Abdou Diallo", "Ismail Jakobs", "Nampalys Mendy", "Pape Matar Sarr", "Idrissa Gueye", "Ismaila Sarr", "Sadio Mane", "Nicolas Jackson", "Teamfoto (SEN)", "Seny Dieng", "Moussa Niakhate", "Fode Ballo-Toure", "Lamine Camara", "Cheikhou Kouyate", "Iliman Ndiaye", "Boulaye Dia"] 
    },
    { 
        prefix: 'IRQ', name: 'Irak', count: 20, flagUrl: 'https://flagcdn.com/w160/iq.png', colors: ['#CE1126', '#007A3D'], group: 'Poule I',
        players: ["Team Logo (Foil)", "Jalal Hassan", "Hussein Ali", "Saad Natiq", "Rebin Sulaka", "Merchas Doski", "Amir Al-Ammari", "Osama Rashid", "Zidane Iqbal", "Ali Jasim", "Ibrahim Bayesh", "Aymen Hussein", "Teamfoto (IRQ)", "Fahad Talib", "Frans Putros", "Zaid Tahseen", "Youssef Amyn", "Bashar Resan", "Montader Madjed", "Mohanad Ali"] 
    },
    { 
        prefix: 'NOR', name: 'Noorwegen', count: 20, flagUrl: 'https://flagcdn.com/w160/no.png', colors: ['#BA0C2F', '#00205B'], group: 'Poule I',
        players: ["Team Logo (Foil)", "Orjan Nyland", "Julian Ryerson", "Kristoffer Ajer", "Leo Ostigard", "Birger Meling", "Sander Berge", "Fredrik Aursnes", "Martin Odegaard", "Oscar Bobb", "Alexander Sorloth", "Erling Haaland", "Teamfoto (NOR)", "Egil Selvik", "Stian Gregersen", "Marcus Pedersen", "Patrick Berg", "Hugo Vetlesen", "Antonio Nusa", "Jorgen Strand Larsen"] 
    },

    // POULE J
    { 
        prefix: 'ARG', name: 'Argentinië', count: 20, flagUrl: 'https://flagcdn.com/w160/ar.png', colors: ['#74ACDF', '#D4AF37'], group: 'Poule J',
        players: ["Team Logo (Foil)", "Emiliano Martinez", "Nahuel Molina", "Cristian Romero", "Nicolas Otamendi", "Nicolas Tagliafico", "Rodrigo De Paul", "Enzo Fernandez", "Alexis Mac Allister", "Lionel Messi", "Alejandro Garnacho", "Julian Alvarez", "Teamfoto (ARG)", "Franco Armani", "Lisandro Martinez", "Marcos Acuna", "Leandro Paredes", "Giovani Lo Celso", "Lautaro Martinez", "Paulo Dybala"] 
    },
    { 
        prefix: 'ALG', name: 'Algerije', count: 20, flagUrl: 'https://flagcdn.com/w160/dz.png', colors: ['#006233', '#D21034'], group: 'Poule J',
        players: ["Team Logo (Foil)", "Anthony Mandrea", "Youcef Atal", "Aissa Mandi", "Ramy Bensebaini", "Rayan Ait-Nouri", "Ismael Bennacer", "Nabil Bentaleb", "Houssem Aouar", "Riyad Mahrez", "Said Benrahma", "Islam Slimani", "Teamfoto (ALG)", "Raïs M'Bolhi", "Ahmed Touba", "Kevin Van Den Kerkhof", "Ramiz Zerrouki", "Farès Chaïbi", "Amine Gouiri", "Baghdad Bounedjah"] 
    },
    { 
        prefix: 'AUT', name: 'Oostenrijk', count: 20, flagUrl: 'https://flagcdn.com/w160/at.png', colors: ['#ED2939', '#222222'], group: 'Poule J',
        players: ["Team Logo (Foil)", "Patrick Pentz", "Stefan Posch", "Kevin Danso", "David Alaba", "Philipp Mwene", "Konrad Laimer", "Nicolas Seiwald", "Marcel Sabitzer", "Christoph Baumgartner", "Michael Gregoritsch", "Marko Arnautovic", "Teamfoto (AUT)", "Heinz Lindner", "Maximilian Wober", "Philipp Lienhart", "Florian Grillitsch", "Xaver Schlager", "Romano Schmid", "Sasa Kalajdzic"] 
    },
    { 
        prefix: 'JOR', name: 'Jordanië', count: 20, flagUrl: 'https://flagcdn.com/w160/jo.png', colors: ['#CE1126', '#000000'], group: 'Poule J',
        players: ["Team Logo (Foil)", "Yazeed Abulaila", "Ihsan Haddad", "Abdallah Nasib", "Yazan Al-Arab", "Salem Al-Ajalin", "Nizar Al-Rashdan", "Noor Al-Rawabdeh", "Mahmoud Al-Mardi", "Musa Al-Taamari", "Ali Olwan", "Yazan Al-Naimat", "Teamfoto (JOR)", "Abdallah Al-Fakhouri", "Bara' Marei", "Mohammad Abu Hasheesh", "Rajaei Ayed", "Saleh Ratib", "Anas Al-Awadat", "Hamza Al-Dardour"] 
    },

    // POULE K
    { 
        prefix: 'POR', name: 'Portugal', count: 20, flagUrl: 'https://flagcdn.com/w160/pt.png', colors: ['#ED2939', '#006600'], group: 'Poule K',
        players: ["Team Logo (Foil)", "Diogo Costa", "Joao Cancelo", "Ruben Dias", "Pepe", "Nuno Mendes", "Joao Palhinha", "Vitinha", "Bruno Fernandes", "Bernardo Silva", "Rafael Leao", "Cristiano Ronaldo", "Teamfoto (POR)", "Rui Patricio", "Goncalo Inacio", "Diogo Dalot", "Ruben Neves", "Otavio", "Diogo Jota", "Goncalo Ramos"] 
    },
    { 
        prefix: 'COD', name: 'Congo-Kinshasa', count: 20, flagUrl: 'https://flagcdn.com/w160/cd.png', colors: ['#007FFF', '#F7D417'], group: 'Poule K',
        players: ["Team Logo (Foil)", "Lionel Mpasi", "Gedeon Kalulu", "Chancel Mbemba", "Henoc Inonga", "Arthur Masuaku", "Charles Pickel", "Samuel Moutoussamy", "Theo Bongonda", "Meschack Elia", "Yoane Wissa", "Cedric Bakambu", "Teamfoto (COD)", "Dimitry Bertaud", "Dylan Batubinsika", "Joris Kayembe", "Aaron Tshibola", "Grady Diangana", "Simon Banza", "Fiston Mayele"] 
    },
    { 
        prefix: 'UZB', name: 'Oezbekistan', count: 20, flagUrl: 'https://flagcdn.com/w160/uz.png', colors: ['#0099B5', '#1EB53A'], group: 'Poule K',
        players: ["Team Logo (Foil)", "Utkir Yusupov", "Khojiakbar Alijonov", "Umar Eshmurodov", "Rustam Ashurmatov", "Farrukh Sayfiev", "Otabek Shukurov", "Odiljon Hamrobekov", "Jaloliddin Masharipov", "Abbosbek Fayzullaev", "Oston Urunov", "Eldor Shomurodov", "Teamfoto (UZB)", "Abduvohid Nematov", "Husniddin Aliqulov", "Sherzod Nasrullaev", "Jamshid Iskanderov", "Khojimat Erkinov", "Azizbek Turgunboev", "Igor Sergeev"] 
    },
    { 
        prefix: 'COL', name: 'Colombia', count: 20, flagUrl: 'https://flagcdn.com/w160/co.png', colors: ['#FCD116', '#CE1126'], group: 'Poule K',
        players: ["Team Logo (Foil)", "Camilo Vargas", "Daniel Munoz", "Davinson Sanchez", "Jhon Lucumi", "Johan Mojica", "Jefferson Lerma", "Richard Rios", "Jhon Arias", "James Rodriguez", "Luis Diaz", "Rafael Santos Borre", "Teamfoto (COL)", "David Ospina", "Yerry Mina", "Santiago Arias", "Mateus Uribe", "Kevin Castano", "Jhon Duran", "Luis Sinisterra"] 
    },

    // POULE L
    { 
        prefix: 'ENG', name: 'Engeland', count: 20, flagUrl: 'https://flagcdn.com/w160/gb-eng.png', colors: ['#ED2939', '#000055'], group: 'Poule L',
        players: ["Team Logo (Foil)", "Jordan Pickford", "Kyle Walker", "John Stones", "Marc Guehi", "Luke Shaw", "Declan Rice", "Trent Alexander-Arnold", "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Harry Kane", "Teamfoto (ENG)", "Aaron Ramsdale", "Harry Maguire", "Kieran Trippier", "Conor Gallagher", "Cole Palmer", "Ollie Watkins", "Ivan Toney"] 
    },
    { 
        prefix: 'CRO', name: 'Kroatië', count: 20, flagUrl: 'https://flagcdn.com/w160/hr.png', colors: ['#ED1C24', '#003893'], group: 'Poule L',
        players: ["Team Logo (Foil)", "Dominik Livakovic", "Josip Juranovic", "Josip Sutalo", "Josko Gvardiol", "Borna Sosa", "Marcelo Brozovic", "Mateo Kovacic", "Luka Modric", "Mario Pasalic", "Andrej Kramaric", "Bruno Petkovic", "Teamfoto (CRO)", "Ivica Ivusic", "Domagoj Vida", "Josip Stanisic", "Lovro Majer", "Luka Ivanusec", "Ivan Perisic", "Ante Budimir"] 
    },
    { 
        prefix: 'GHA', name: 'Ghana', count: 20, flagUrl: 'https://flagcdn.com/w160/gh.png', colors: ['#CE1126', '#FCD116'], group: 'Poule L',
        players: ["Team Logo (Foil)", "Lawrence Ati-Zigi", "Denis Odoi", "Alexander Djiku", "Mohammed Salisu", "Gideon Mensah", "Salis Abdul Samed", "Thomas Partey", "Mohammed Kudus", "Jordan Ayew", "Inaki Williams", "Antoine Semenyo", "Teamfoto (GHA)", "Richard Ofori", "Daniel Amartey", "Tariq Lamptey", "Majeed Ashimeru", "Andre Ayew", "Ernest Nuamah", "Osman Bukari"] 
    },
    { 
        prefix: 'PAN', name: 'Panama', count: 20, flagUrl: 'https://flagcdn.com/w160/pa.png', colors: ['#DA291C', '#002B7F'], group: 'Poule L',
        players: ["Team Logo (Foil)", "Orlando Mosquera", "Michael Murillo", "Fidel Escobar", "Jose Cordoba", "Andres Andrade", "Anibal Godoy", "Adalberto Carrasquilla", "Edgar Barcenas", "Ismael Diaz", "Jose Fajardo", "Cecilio Waterman", "Teamfoto (PAN)", "Luis Mejia", "Harold Cummings", "Eric Davis", "Cristian Martinez", "Alberto Quintero", "Freddy Gondola", "Eduardo Guerrero"] 
    }
];
