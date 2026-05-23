// countries.js - Met Spelersnamen Database

const collections = [
    { 
        prefix: 'FWC', name: 'FIFA World Cup', count: 20, 
        flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Logo_de_la_Copa_Mundial_de_f%C3%BAtbol_2026.svg/200px-Logo_de_la_Copa_Mundial_de_f%C3%BAtbol_2026.svg.png', 
        colors: ['#4f46e5', '#ff005b'], group: 'Introductie',
        players: ["Panini Logo (00)", "Official Emblem 1", "Official Emblem 2", "Official Mascots", "Official Slogan", "Official Match Ball", "Host Canada", "Host Mexico", "Host USA", "Stadium 1", "Stadium 2", "Stadium 3", "Stadium 4", "Stadium 5", "Stadium 6", "Stadium 7", "Stadium 8", "World Cup Trophy 1", "World Cup Trophy 2", "FIFA Legends"] 
    },
    // Poule A
    { prefix: 'MEX', name: 'Mexico', count: 20, flagUrl: 'https://flagcdn.com/w160/mx.png', colors: ['#006847', '#CE1126'], group: 'Poule A' },
    { prefix: 'RSA', name: 'Zuid-Afrika', count: 20, flagUrl: 'https://flagcdn.com/w160/za.png', colors: ['#007749', '#FFB81C'], group: 'Poule A' },
    { prefix: 'KOR', name: 'Zuid-Korea', count: 20, flagUrl: 'https://flagcdn.com/w160/kr.png', colors: ['#CD2E3A', '#0047A0'], group: 'Poule A' },
    { prefix: 'CZE', name: 'Tsjechië', count: 20, flagUrl: 'https://flagcdn.com/w160/cz.png', colors: ['#D7141A', '#11457E'], group: 'Poule A' },

    // Poule B
    { prefix: 'CAN', name: 'Canada', count: 20, flagUrl: 'https://flagcdn.com/w160/ca.png', colors: ['#FF0000', '#444444'], group: 'Poule B' },
    { prefix: 'BIH', name: 'Bosnië en Her.', count: 20, flagUrl: 'https://flagcdn.com/w160/ba.png', colors: ['#002395', '#FECB00'], group: 'Poule B' },
    { prefix: 'QAT', name: 'Qatar', count: 20, flagUrl: 'https://flagcdn.com/w160/qa.png', colors: ['#8A1538', '#666666'], group: 'Poule B' },
    { prefix: 'SUI', name: 'Zwitserland', count: 20, flagUrl: 'https://flagcdn.com/w160/ch.png', colors: ['#FF0000', '#333333'], group: 'Poule B' },

    // Poule C
    { prefix: 'BRA', name: 'Brazilië', count: 20, flagUrl: 'https://flagcdn.com/w160/br.png', colors: ['#009739', '#FFDF00'], group: 'Poule C' },
    { prefix: 'MAR', name: 'Marokko', count: 20, flagUrl: 'https://flagcdn.com/w160/ma.png', colors: ['#C1272D', '#006233'], group: 'Poule C' },
    { prefix: 'HAI', name: 'Haïti', count: 20, flagUrl: 'https://flagcdn.com/w160/ht.png', colors: ['#D21034', '#00205B'], group: 'Poule C' },
    { prefix: 'SCO', name: 'Schotland', count: 20, flagUrl: 'https://flagcdn.com/w160/gb-sct.png', colors: ['#005EB8', '#FFFFFF'], group: 'Poule C' },

    // Poule D
    { prefix: 'USA', name: 'Verenigde Staten', count: 20, flagUrl: 'https://flagcdn.com/w160/us.png', colors: ['#B22234', '#3C3B6E'], group: 'Poule D' },
    { prefix: 'PAR', name: 'Paraguay', count: 20, flagUrl: 'https://flagcdn.com/w160/py.png', colors: ['#D52B1E', '#0038A8'], group: 'Poule D' },
    { prefix: 'AUS', name: 'Australië', count: 20, flagUrl: 'https://flagcdn.com/w160/au.png', colors: ['#FFCD00', '#008751'], group: 'Poule D' },
    { prefix: 'TUR', name: 'Turkije', count: 20, flagUrl: 'https://flagcdn.com/w160/tr.png', colors: ['#E30A17', '#222222'], group: 'Poule D' },

    // Poule E
    { prefix: 'GER', name: 'Duitsland', count: 20, flagUrl: 'https://flagcdn.com/w160/de.png', colors: ['#222222', '#FFCE00'], group: 'Poule E' },
    { prefix: 'CUW', name: 'Curaçao', count: 20, flagUrl: 'https://flagcdn.com/w160/cw.png', colors: ['#002B7F', '#F9E814'], group: 'Poule E' },
    { prefix: 'CIV', name: 'Ivoorkust', count: 20, flagUrl: 'https://flagcdn.com/w160/ci.png', colors: ['#F77F00', '#009E60'], group: 'Poule E' },
    { prefix: 'ECU', name: 'Ecuador', count: 20, flagUrl: 'https://flagcdn.com/w160/ec.png', colors: ['#FFD100', '#00205B'], group: 'Poule E' },

    // Poule F
    { 
        prefix: 'NED', name: 'Nederland', count: 20, 
        flagUrl: 'https://flagcdn.com/w160/nl.png', colors: ['#F36C21', '#21468B'], group: 'Poule F',
        players: ["Team Logo (Foil)", "Bart Verbruggen", "Virgil van Dijk", "Nathan Aké", "Denzel Dumfries", "Matthijs de Ligt", "Stefan de Vrij", "Jeremie Frimpong", "Frenkie de Jong", "Tijjani Reijnders", "Joey Veerman", "Xavi Simons", "Teamfoto (NED)", "Teun Koopmeiners", "Cody Gakpo", "Memphis Depay", "Donyell Malen", "Wout Weghorst", "Brian Brobbey", "Steven Bergwijn"]
    },
    { prefix: 'JPN', name: 'Japan', count: 20, flagUrl: 'https://flagcdn.com/w160/jp.png', colors: ['#000555', '#BC002D'], group: 'Poule F' },
    { prefix: 'SWE', name: 'Zweden', count: 20, flagUrl: 'https://flagcdn.com/w160/se.png', colors: ['#004B87', '#FFCD00'], group: 'Poule F' },
    { prefix: 'TUN', name: 'Tunesië', count: 20, flagUrl: 'https://flagcdn.com/w160/tn.png', colors: ['#E70013', '#444444'], group: 'Poule F' },

    // Poule G
    { 
        prefix: 'BEL', name: 'België', count: 20, 
        flagUrl: 'https://flagcdn.com/w160/be.png', colors: ['#ED2939', '#FDDA24'], group: 'Poule G',
        players: ["Team Logo (Foil)", "Thibaut Courtois", "Arthur Theate", "Timothy Castagne", "Zeno Debast", "Wout Faes", "Axel Witsel", "Thomas Meunier", "Amadou Onana", "Orel Mangala", "Youri Tielemans", "Kevin De Bruyne", "Teamfoto (BEL)", "Jeremy Doku", "Leandro Trossard", "Johan Bakayoko", "Lois Openda", "Romelu Lukaku", "M. Fernandez-Pardo", "Dodi Lukebakio"]
    },
    { prefix: 'EGY', name: 'Egypte', count: 20, flagUrl: 'https://flagcdn.com/w160/eg.png', colors: ['#CE1126', '#111111'], group: 'Poule G' },
    { prefix: 'IRN', name: 'Iran', count: 20, flagUrl: 'https://flagcdn.com/w160/ir.png', colors: ['#239F40', '#DA0000'], group: 'Poule G' },
    { prefix: 'NZL', name: 'Nieuw-Zeeland', count: 20, flagUrl: 'https://flagcdn.com/w160/nz.png', colors: ['#111111', '#888888'], group: 'Poule G' },

    // Poule H
    { prefix: 'ESP', name: 'Spanje', count: 20, flagUrl: 'https://flagcdn.com/w160/es.png', colors: ['#AA151B', '#F1BF00'], group: 'Poule H' },
    { prefix: 'CPV', name: 'Kaapverdië', count: 20, flagUrl: 'https://flagcdn.com/w160/cv.png', colors: ['#003893', '#CF2027'], group: 'Poule H' },
    { prefix: 'KSA', name: 'Saoedi-Arabië', count: 20, flagUrl: 'https://flagcdn.com/w160/sa.png', colors: ['#006C35', '#D4AF37'], group: 'Poule H' },
    { prefix: 'URU', name: 'Uruguay', count: 20, flagUrl: 'https://flagcdn.com/w160/uy.png', colors: ['#0081C8', '#FCD116'], group: 'Poule H' },

    // Poule I
    { prefix: 'FRA', name: 'Frankrijk', count: 20, flagUrl: 'https://flagcdn.com/w160/fr.png', colors: ['#002395', '#ED2939'], group: 'Poule I' },
    { prefix: 'SEN', name: 'Senegal', count: 20, flagUrl: 'https://flagcdn.com/w160/sn.png', colors: ['#00853F', '#FDEF42'], group: 'Poule I' },
    { prefix: 'IRQ', name: 'Irak', count: 20, flagUrl: 'https://flagcdn.com/w160/iq.png', colors: ['#CE1126', '#007A3D'], group: 'Poule I' },
    { prefix: 'NOR', name: 'Noorwegen', count: 20, flagUrl: 'https://flagcdn.com/w160/no.png', colors: ['#BA0C2F', '#00205B'], group: 'Poule I' },

    // Poule J
    { prefix: 'ARG', name: 'Argentinië', count: 20, flagUrl: 'https://flagcdn.com/w160/ar.png', colors: ['#74ACDF', '#D4AF37'], group: 'Poule J' },
    { prefix: 'ALG', name: 'Algerije', count: 20, flagUrl: 'https://flagcdn.com/w160/dz.png', colors: ['#006233', '#D21034'], group: 'Poule J' },
    { prefix: 'AUT', name: 'Oostenrijk', count: 20, flagUrl: 'https://flagcdn.com/w160/at.png', colors: ['#ED2939', '#222222'], group: 'Poule J' },
    { prefix: 'JOR', name: 'Jordanië', count: 20, flagUrl: 'https://flagcdn.com/w160/jo.png', colors: ['#CE1126', '#000000'], group: 'Poule J' },

    // Poule K
    { prefix: 'POR', name: 'Portugal', count: 20, flagUrl: 'https://flagcdn.com/w160/pt.png', colors: ['#ED2939', '#006600'], group: 'Poule K' },
    { prefix: 'COD', name: 'Congo-Kinshasa', count: 20, flagUrl: 'https://flagcdn.com/w160/cd.png', colors: ['#007FFF', '#F7D417'], group: 'Poule K' },
    { prefix: 'UZB', name: 'Oezbekistan', count: 20, flagUrl: 'https://flagcdn.com/w160/uz.png', colors: ['#0099B5', '#1EB53A'], group: 'Poule K' },
    { prefix: 'COL', name: 'Colombia', count: 20, flagUrl: 'https://flagcdn.com/w160/co.png', colors: ['#FCD116', '#CE1126'], group: 'Poule K' },

    // Poule L
    { prefix: 'ENG', name: 'Engeland', count: 20, flagUrl: 'https://flagcdn.com/w160/gb-eng.png', colors: ['#ED2939', '#000055'], group: 'Poule L' },
    { prefix: 'CRO', name: 'Kroatië', count: 20, flagUrl: 'https://flagcdn.com/w160/hr.png', colors: ['#ED1C24', '#003893'], group: 'Poule L' },
    { prefix: 'GHA', name: 'Ghana', count: 20, flagUrl: 'https://flagcdn.com/w160/gh.png', colors: ['#CE1126', '#FCD116'], group: 'Poule L' },
    { prefix: 'PAN', name: 'Panama', count: 20, flagUrl: 'https://flagcdn.com/w160/pa.png', colors: ['#DA291C', '#002B7F'], group: 'Poule L' }
];
