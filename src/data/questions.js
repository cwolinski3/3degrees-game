export const questions = {
  "History": [
    {
      topic: "American Revolution",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Massachusetts (a key city during the American Revolution)?",
          choices: ["Boston", "Providence", "Hartford", "Albany"],
          answer: "Boston",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name one major battle of the American Revolution.",
          answer: ["Bunker Hill", "Lexington", "Concord"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Who was the commander-in-chief of the Continental Army?",
          choices: ["George Washington", "John Adams", "Benjamin Franklin", "Thomas Jefferson"],
          answer: "George Washington",
          bonus: 5
        }
      }
    },
    {
      topic: "Ancient Rome",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of ancient Rome?",
          choices: ["Rome", "Athens", "Carthage", "Alexandria"],
          answer: "Rome",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name one famous Roman emperor.",
          answer: ["Augustus", "Nero", "Caligula", "Marcus Aurelius"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which Roman structure hosted gladiatorial contests?",
          choices: ["Colosseum", "Pantheon", "Forum", "Circus Maximus"],
          answer: "Colosseum",
          bonus: 5
        }
      }
    },
    {
      topic: "Medieval Europe",
      degrees: {
        1: { 
          type: "mc",
          question: "What period is known as the Middle Ages?",
          choices: ["Middle Ages", "Dark Ages", "Feudal Age", "Medieval Period"],
          answer: "Middle Ages",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which document, signed in 1215, limited the power of the English king?",
          answer: ["Magna Carta"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a famous medieval castle in England.",
          choices: ["Windsor Castle", "Leeds Castle", "Warwick Castle", "Bamburgh Castle"],
          answer: "Windsor Castle",
          bonus: 5
        }
      }
    },
    {
      topic: "World War I",
      degrees: {
        1: { 
          type: "mc",
          question: "In what year did World War I begin?",
          choices: ["1912", "1914", "1916", "1918"],
          answer: "1914",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What event sparked World War I?",
          answer: ["Assassination of Archduke Franz Ferdinand"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which treaty ended World War I?",
          choices: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Trianon", "Treaty of Brest-Litovsk"],
          answer: "Treaty of Versailles",
          bonus: 5
        }
      }
    },
    {
      topic: "World War II",
      degrees: {
        1: { 
          type: "mc",
          question: "In what year did World War II begin?",
          choices: ["1937", "1939", "1941", "1943"],
          answer: "1939",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which battle marked a turning point on the Eastern Front?",
          answer: ["Battle of Stalingrad"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What was the codename for the Allied invasion of Normandy?",
          choices: ["Operation Overlord", "Operation Torch", "Operation Market Garden", "Operation Neptune"],
          answer: "Operation Overlord",
          bonus: 5
        }
      }
    }
  ],
  "Science": [
    {
      topic: "Space Exploration",
      degrees: {
        1: { 
          type: "mc",
          question: "Which planet is known as the Red Planet?",
          choices: ["Mars", "Venus", "Jupiter", "Saturn"],
          answer: "Mars",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Who was the first human to travel into space?",
          answer: ["Yuri Gagarin"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What is the name of NASA's space telescope launched in 1990?",
          choices: ["Hubble", "Chandra", "Spitzer", "Kepler"],
          answer: "Hubble",
          bonus: 5
        }
      }
    },
    {
      topic: "Biology",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the basic unit of life?",
          choices: ["Cell", "Atom", "Molecule", "Organ"],
          answer: "Cell",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which organelle is known as the powerhouse of the cell?",
          answer: ["Mitochondria"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What process do plants use to convert sunlight into energy?",
          choices: ["Photosynthesis", "Respiration", "Transpiration", "Fermentation"],
          answer: "Photosynthesis",
          bonus: 5
        }
      }
    },
    {
      topic: "Chemistry",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the chemical formula for water?",
          choices: ["H2O", "HO2", "OH2", "HHO"],
          answer: "H2O",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is the chemical symbol for gold?",
          answer: ["Au"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "At what pH is a solution considered neutral?",
          choices: ["5", "6", "7", "8"],
          answer: "7",
          bonus: 5
        }
      }
    },
    {
      topic: "Physics",
      degrees: {
        1: { 
          type: "mc",
          question: "What force keeps us on the ground?",
          choices: ["Gravity", "Friction", "Magnetism", "Inertia"],
          answer: "Gravity",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is the unit of force?",
          answer: ["Newton"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which famous equation did Einstein propose?",
          choices: ["E=mc^2", "F=ma", "V=IR", "P=IV"],
          answer: "E=mc^2",
          bonus: 5
        }
      }
    },
    {
      topic: "Earth Science",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the most abundant gas in Earth's atmosphere?",
          choices: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
          answer: "Nitrogen",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is the outermost layer of Earth called?",
          answer: ["Crust"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What instrument measures earthquakes?",
          choices: ["Seismograph", "Barometer", "Thermometer", "Anemometer"],
          answer: "Seismograph",
          bonus: 5
        }
      }
    }
  ],
  "Geography": [
    {
      topic: "European Capitals",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of France?",
          choices: ["Paris", "Berlin", "Madrid", "Rome"],
          answer: "Paris",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is France located?",
          answer: ["Europe"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders France.",
          choices: ["Spain", "Germany", "Italy", "Belgium"],
          answer: "Spain",
          bonus: 5
        }
      }
    },
    {
      topic: "African Capitals",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Nigeria?",
          choices: ["Abuja", "Lagos", "Kano", "Port Harcourt"],
          answer: "Abuja",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Nigeria located?",
          answer: ["Africa"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Nigeria.",
          choices: ["Niger", "Cameroon", "Chad", "Benin"],
          answer: "Niger",
          bonus: 5
        }
      }
    },
    {
      topic: "Asian Geography",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Japan?",
          choices: ["Tokyo", "Osaka", "Seoul", "Beijing"],
          answer: "Tokyo",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Japan located?",
          answer: ["Asia"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Japan.",
          choices: ["South Korea", "China", "North Korea", "Russia"],
          answer: "South Korea",
          bonus: 5
        }
      }
    },
    {
      topic: "North American Geography",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Canada?",
          choices: ["Ottawa", "Toronto", "Vancouver", "Montreal"],
          answer: "Ottawa",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Canada located?",
          answer: ["North America"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Canada.",
          choices: ["United States", "Mexico", "Greenland", "Russia"],
          answer: "United States",
          bonus: 5
        }
      }
    },
    {
      topic: "South American Geography",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Brazil?",
          choices: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
          answer: "Brasília",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Brazil located?",
          answer: ["South America"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Brazil.",
          choices: ["Argentina", "Colombia", "Peru", "Bolivia"],
          answer: "Argentina",
          bonus: 5
        }
      }
    }
  ],
  "Math": [
    {
      topic: "Basic Arithmetic",
      degrees: {
        1: { 
          type: "mc",
          question: "What is 2 + 2?",
          choices: ["4", "3", "5", "6"],
          answer: "4",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is 10 - 3?",
          answer: ["7"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What is 3 x 3?",
          choices: ["9", "6", "12", "15"],
          answer: "9",
          bonus: 5
        }
      }
    },
    {
      topic: "Fractions",
      degrees: {
        1: { 
          type: "mc",
          question: "What is 1/2 as a decimal?",
          choices: ["0.5", "0.2", "0.8", "1"],
          answer: "0.5",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is 3/4 as a decimal?",
          answer: ["0.75"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What is 1/3 (approximately) as a decimal?",
          choices: ["0.33", "0.3", "0.5", "0.25"],
          answer: "0.33",
          bonus: 5
        }
      }
    },
    {
      topic: "Geometry",
      degrees: {
        1: { 
          type: "mc",
          question: "How many sides does a triangle have?",
          choices: ["3", "4", "5", "6"],
          answer: "3",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "How many sides does a rectangle have?",
          answer: ["4"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "How many sides does a pentagon have?",
          choices: ["5", "4", "6", "7"],
          answer: "5",
          bonus: 5
        }
      }
    },
    {
      topic: "Algebra",
      degrees: {
        1: { 
          type: "mc",
          question: "Solve for x: 2x = 10",
          choices: ["5", "4", "6", "8"],
          answer: "5",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Solve for x: x + 3 = 7",
          answer: ["4"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Solve for x: 3x - 2 = 7",
          choices: ["3", "4", "5", "2"],
          answer: "3",
          bonus: 5
        }
      }
    },
    {
      topic: "Advanced Math",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the approximate value of π?",
          choices: ["3.14", "3.00", "3.50", "2.71"],
          answer: "3.14",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is 12 squared?",
          answer: ["144"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What is the square root of 81?",
          choices: ["9", "8", "10", "7"],
          answer: "9",
          bonus: 5
        }
      }
    }
  ],
  "Literature": [
    {
      topic: "Shakespeare",
      degrees: {
        1: { 
          type: "mc",
          question: "Who wrote 'Romeo and Juliet'?",
          choices: ["William Shakespeare", "Christopher Marlowe", "Ben Jonson", "John Milton"],
          answer: "William Shakespeare",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name one tragedy by Shakespeare.",
          answer: ["Hamlet", "Macbeth", "Othello", "King Lear"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which play features the character Prospero?",
          choices: ["The Tempest", "Much Ado About Nothing", "Twelfth Night", "As You Like It"],
          answer: "The Tempest",
          bonus: 5
        }
      }
    },
    {
      topic: "Modern Novels",
      degrees: {
        1: { 
          type: "mc",
          question: "Who wrote 'Harry Potter and the Sorcerer’s Stone'?",
          choices: ["J.K. Rowling", "Stephenie Meyer", "Suzanne Collins", "Rick Riordan"],
          answer: "J.K. Rowling",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name one book from the 'Hunger Games' series.",
          answer: ["The Hunger Games", "Catching Fire", "Mockingjay"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which novel features Katniss Everdeen?",
          choices: ["The Hunger Games", "Divergent", "The Maze Runner", "Legend"],
          answer: "The Hunger Games",
          bonus: 5
        }
      }
    },
    {
      topic: "Classics",
      degrees: {
        1: { 
          type: "mc",
          question: "Who wrote 'Pride and Prejudice'?",
          choices: ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Mary Shelley"],
          answer: "Jane Austen",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which novel features Elizabeth Bennet?",
          answer: ["Pride and Prejudice"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Who authored 'Sense and Sensibility'?",
          choices: ["Jane Austen", "Charles Dickens", "William Thackeray", "George Eliot"],
          answer: "Jane Austen",
          bonus: 5
        }
      }
    },
    {
      topic: "Epic Poetry",
      degrees: {
        1: { 
          type: "mc",
          question: "Who wrote 'The Odyssey'?",
          choices: ["Homer", "Virgil", "Ovid", "Sophocles"],
          answer: "Homer",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is the subject of 'The Iliad'?",
          answer: ["Trojan War"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name one hero from the Trojan War.",
          choices: ["Achilles", "Hector", "Agamemnon", "Paris"],
          answer: "Achilles",
          bonus: 5
        }
      }
    },
    {
      topic: "Contemporary",
      degrees: {
        1: { 
          type: "mc",
          question: "Who wrote 'The Road'?",
          choices: ["Cormac McCarthy", "Don DeLillo", "T.C. Boyle", "Norman Mailer"],
          answer: "Cormac McCarthy",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name one Pulitzer Prize-winning novel from the 2000s.",
          answer: ["The Road", "Middlesex", "The Brief Wondrous Life of Oscar Wao"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which contemporary author wrote 'Atonement'?",
          choices: ["Ian McEwan", "Zadie Smith", "Julian Barnes", "Kazuo Ishiguro"],
          answer: "Ian McEwan",
          bonus: 5
        }
      }
    }
  ],
  "Sports": [
    {
      topic: "Soccer",
      degrees: {
        1: { 
          type: "mc",
          question: "How many players are on a soccer team on the field?",
          choices: ["11", "10", "9", "12"],
          answer: "11",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which country won the 2018 FIFA World Cup?",
          answer: ["France"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a famous Spanish soccer team.",
          choices: ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla"],
          answer: ["Real Madrid", "Barcelona"],
          bonus: 5
        }
      }
    },
    {
      topic: "Baseball",
      degrees: {
        1: { 
          type: "mc",
          question: "How many innings are in a standard baseball game?",
          choices: ["9", "7", "10", "8"],
          answer: "9",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is a home run?",
          answer: ["A hit that allows the batter to round all bases"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a Major League Baseball team from New York.",
          choices: ["New York Yankees", "Mets", "Giants", "Dodgers"],
          answer: "New York Yankees",
          bonus: 5
        }
      }
    },
    {
      topic: "Basketball",
      degrees: {
        1: { 
          type: "mc",
          question: "How many players are on a basketball team on the court?",
          choices: ["5", "6", "7", "4"],
          answer: "5",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which league is the top professional basketball league in the US?",
          answer: ["NBA"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a famous NBA player.",
          choices: ["Michael Jordan", "LeBron James", "Kobe Bryant", "Magic Johnson"],
          answer: ["Michael Jordan", "LeBron James"],
          bonus: 5
        }
      }
    },
    {
      topic: "Tennis",
      degrees: {
        1: { 
          type: "mc",
          question: "How many sets are played in a best-of-three tennis match?",
          choices: ["3", "5", "1", "2"],
          answer: "3",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is it called when a player wins a set without losing a game?",
          answer: ["Bagel"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name one Grand Slam tournament.",
          choices: ["Wimbledon", "US Open", "French Open", "Australian Open"],
          answer: "Wimbledon",
          bonus: 5
        }
      }
    },
    {
      topic: "Olympics",
      degrees: {
        1: { 
          type: "mc",
          question: "In which sport is synchronized swimming featured?",
          choices: ["Swimming", "Diving", "Gymnastics", "Track and Field"],
          answer: "Swimming",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "In what year did the modern Olympics begin?",
          answer: ["1896"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which city hosted the 2012 Summer Olympics?",
          choices: ["London", "Beijing", "Rio de Janeiro", "Athens"],
          answer: "London",
          bonus: 5
        }
      }
    }
  ],
  "Music": [
    {
      topic: "Pop Music",
      degrees: {
        1: { 
          type: "mc",
          question: "Who is known as the King of Pop?",
          choices: ["Michael Jackson", "Prince", "Elvis", "Madonna"],
          answer: "Michael Jackson",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which pop star released the album 'Thriller'?",
          answer: ["Michael Jackson"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a hit single by Madonna.",
          choices: ["Like a Virgin", "Material Girl", "Vogue", "Papa Don't Preach"],
          answer: "Like a Virgin",
          bonus: 5
        }
      }
    },
    {
      topic: "Rock",
      degrees: {
        1: { 
          type: "mc",
          question: "Which band is famous for 'Stairway to Heaven'?",
          choices: ["Led Zeppelin", "The Rolling Stones", "Pink Floyd", "AC/DC"],
          answer: "Led Zeppelin",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Who is the lead singer of Queen?",
          answer: ["Freddie Mercury"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a classic rock album by The Rolling Stones.",
          choices: ["Sticky Fingers", "Exile on Main St.", "Let It Bleed", "Beggars Banquet"],
          answer: "Sticky Fingers",
          bonus: 5
        }
      }
    },
    {
      topic: "Hip-Hop",
      degrees: {
        1: { 
          type: "mc",
          question: "Who is known as the 'King of Hip-Hop'?",
          choices: ["Jay-Z", "Eminem", "Kanye West", "Dr. Dre"],
          answer: "Jay-Z",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which artist released the album 'The Blueprint'?",
          answer: ["Jay-Z"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a famous hip-hop group.",
          choices: ["Wu-Tang Clan", "N.W.A", "A Tribe Called Quest", "Outkast"],
          answer: "Wu-Tang Clan",
          bonus: 5
        }
      }
    },
    {
      topic: "Classical",
      degrees: {
        1: { 
          type: "mc",
          question: "Who composed 'Für Elise'?",
          choices: ["Beethoven", "Mozart", "Bach", "Chopin"],
          answer: "Beethoven",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which musical period is associated with Mozart?",
          answer: ["Classical"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a famous symphony by Beethoven.",
          choices: ["Symphony No. 9", "Symphony No. 5", "Symphony No. 3", "Symphony No. 7"],
          answer: "Symphony No. 9",
          bonus: 5
        }
      }
    },
    {
      topic: "Jazz",
      degrees: {
        1: { 
          type: "mc",
          question: "Which instrument is central to jazz music?",
          choices: ["Saxophone", "Piano", "Trumpet", "Drums"],
          answer: "Saxophone",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name a famous jazz musician.",
          answer: ["Miles Davis", "John Coltrane"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What is a common term for a jazz improv session?",
          choices: ["Jam session", "Sesh", "Improv", "Solo"],
          answer: "Jam session",
          bonus: 5
        }
      }
    }
  ],
  "Art": [
    {
      topic: "Renaissance",
      degrees: {
        1: { 
          type: "mc",
          question: "Who painted the Mona Lisa?",
          choices: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"],
          answer: "Leonardo da Vinci",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which artist sculpted 'David'?",
          answer: ["Michelangelo"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a key work by Raphael.",
          choices: ["The School of Athens", "The Last Supper", "The Creation of Adam", "The Birth of Venus"],
          answer: "The School of Athens",
          bonus: 5
        }
      }
    },
    {
      topic: "Modern Art",
      degrees: {
        1: { 
          type: "mc",
          question: "What art movement is associated with Picasso?",
          choices: ["Cubism", "Surrealism", "Impressionism", "Expressionism"],
          answer: "Cubism",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What style is Salvador Dalí known for?",
          answer: ["Surrealism"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which artist is famous for his drip paintings?",
          choices: ["Jackson Pollock", "Andy Warhol", "Roy Lichtenstein", "Mark Rothko"],
          answer: "Jackson Pollock",
          bonus: 5
        }
      }
    },
    {
      topic: "Impressionism",
      degrees: {
        1: { 
          type: "mc",
          question: "Which painter is known for 'Impression, Sunrise'?",
          choices: ["Claude Monet", "Edgar Degas", "Pierre-Auguste Renoir", "Camille Pissarro"],
          answer: "Claude Monet",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What art movement is characterized by loose brushwork and light colors?",
          answer: ["Impressionism"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name another famous Impressionist artist.",
          choices: ["Pierre-Auguste Renoir", "Claude Monet", "Edgar Degas", "Camille Pissarro"],
          answer: "Pierre-Auguste Renoir",
          bonus: 5
        }
      }
    },
    {
      topic: "Abstract Art",
      degrees: {
        1: { 
          type: "mc",
          question: "Which artist is known for abstract expressionism?",
          choices: ["Jackson Pollock", "Mark Rothko", "Willem de Kooning", "Barnett Newman"],
          answer: "Jackson Pollock",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What term describes non-representational art?",
          answer: ["Abstract"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a famous abstract painter.",
          choices: ["Mark Rothko", "Piet Mondrian", "Paul Klee", "Joan Miró"],
          answer: "Mark Rothko",
          bonus: 5
        }
      }
    },
    {
      topic: "Street Art",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the term for art created on public walls?",
          choices: ["Graffiti", "Mural", "Stencil", "Tagging"],
          answer: "Graffiti",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which artist is famous for stenciled street art?",
          answer: ["Banksy"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a city known for its vibrant street art scene.",
          choices: ["Berlin", "New York", "London", "Paris"],
          answer: "Berlin",
          bonus: 5
        }
      }
    }
  ],
  "Technology": [
    {
      topic: "Computing",
      degrees: {
        1: { 
          type: "mc",
          question: "What does CPU stand for?",
          choices: ["Central Processing Unit", "Computer Personal Unit", "Central Performance Unit", "Central Processing Utility"],
          answer: "Central Processing Unit",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is the primary language for web development?",
          answer: ["JavaScript"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which company created the iPhone?",
          choices: ["Apple", "Samsung", "Google", "Microsoft"],
          answer: "Apple",
          bonus: 5
        }
      }
    },
    {
      topic: "Internet",
      degrees: {
        1: { 
          type: "mc",
          question: "What does URL stand for?",
          choices: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Response Loader", "Universal Resource Locator"],
          answer: "Uniform Resource Locator",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which search engine is most popular?",
          answer: ["Google"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What does HTTP stand for?",
          choices: ["Hypertext Transfer Protocol", "Hypertext Transmission Protocol", "Hyperlink Transfer Protocol", "Hypertext Transport Protocol"],
          answer: "Hypertext Transfer Protocol",
          bonus: 5
        }
      }
    },
    {
      topic: "Programming",
      degrees: {
        1: { 
          type: "mc",
          question: "Which language is often called the language of the web?",
          choices: ["JavaScript", "Python", "Ruby", "Java"],
          answer: "JavaScript",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name one object-oriented programming language.",
          answer: ["Java", "C++"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What language is commonly used for statistical computing?",
          choices: ["R", "Python", "SAS", "JavaScript"],
          answer: "R",
          bonus: 5
        }
      }
    },
    {
      topic: "Gadgets",
      degrees: {
        1: { 
          type: "mc",
          question: "Which company produces the Galaxy smartphone series?",
          choices: ["Samsung", "Apple", "Huawei", "LG"],
          answer: "Samsung",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What device is used for reading e-books?",
          answer: ["Kindle"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What wearable device tracks your fitness and heart rate?",
          choices: ["Fitbit", "Apple Watch", "Garmin", "Samsung Gear"],
          answer: "Fitbit",
          bonus: 5
        }
      }
    },
    {
      topic: "Emerging Tech",
      degrees: {
        1: { 
          type: "mc",
          question: "What does AI stand for?",
          choices: ["Artificial Intelligence", "Automated Integration", "Advanced Information", "Analog Input"],
          answer: "Artificial Intelligence",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What technology is considered the future of computing?",
          answer: ["Quantum computing"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What is blockchain primarily used for?",
          choices: ["Cryptocurrency", "Data Storage", "Networking", "Cloud Computing"],
          answer: "Cryptocurrency",
          bonus: 5
        }
      }
    }
  ],
  "Politics": [
    {
      topic: "US Politics",
      degrees: {
        1: { 
          type: "mc",
          question: "Who is the current President of the United States (as of 2021)?",
          choices: ["Joe Biden", "Donald Trump", "Barack Obama", "George W. Bush"],
          answer: "Joe Biden",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What branch of the US government makes the laws?",
          answer: ["Legislative"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What is the upper chamber of the US Congress called?",
          choices: ["Senate", "House", "Congress", "Supreme Court"],
          answer: "Senate",
          bonus: 5
        }
      }
    },
    {
      topic: "UK Politics",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of the United Kingdom?",
          choices: ["London", "Edinburgh", "Cardiff", "Belfast"],
          answer: "London",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is the lower chamber of the UK Parliament called?",
          answer: ["House of Commons"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Who is the Prime Minister of the UK (as of 2021)?",
          choices: ["Boris Johnson", "Theresa May", "David Cameron", "Rishi Sunak"],
          answer: "Boris Johnson",
          bonus: 5
        }
      }
    },
    {
      topic: "European Union",
      degrees: {
        1: { 
          type: "mc",
          question: "What currency is used by most EU countries?",
          choices: ["Euro", "Pound", "Dollar", "Franc"],
          answer: "Euro",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "How many member countries are in the EU (approximately)?",
          answer: ["27"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What is the main governing body of the EU?",
          choices: ["European Commission", "European Parliament", "European Council", "European Central Bank"],
          answer: "European Commission",
          bonus: 5
        }
      }
    },
    {
      topic: "Global Organizations",
      degrees: {
        1: { 
          type: "mc",
          question: "What does the UN stand for?",
          choices: ["United Nations", "United Network", "Universal Nations", "United Nova"],
          answer: "United Nations",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What is the main goal of the UN?",
          answer: ["Maintain international peace", "Peace"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name one UN agency.",
          choices: ["WHO", "UNICEF", "FAO", "ILO"],
          answer: "WHO",
          bonus: 5
        }
      }
    },
    {
      topic: "Political Ideologies",
      degrees: {
        1: { 
          type: "mc",
          question: "What ideology emphasizes free markets and limited government?",
          choices: ["Liberalism", "Socialism", "Communism", "Fascism"],
          answer: "Liberalism",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which ideology advocates for government control of resources?",
          answer: ["Socialism"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "What term describes a mix of capitalism and socialism?",
          choices: ["Mixed economy", "Social democracy", "Market socialism", "Liberal capitalism"],
          answer: "Mixed economy",
          bonus: 5
        }
      }
    }
  ],
  "Movies": [
    {
      topic: "Blockbusters",
      degrees: {
        1: { 
          type: "mc",
          question: "Which film features Darth Vader?",
          choices: ["Star Wars", "Star Trek", "Blade Runner", "The Matrix"],
          answer: "Star Wars",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What film is known for its alien invasion plot?",
          answer: ["Independence Day"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name the highest-grossing film (as of 2021).",
          choices: ["Avatar", "Titanic", "Star Wars", "Avengers: Endgame"],
          answer: "Avatar",
          bonus: 5
        }
      }
    },
    {
      topic: "Directors",
      degrees: {
        1: { 
          type: "mc",
          question: "Who directed 'Jurassic Park'?",
          choices: ["Steven Spielberg", "James Cameron", "George Lucas", "Ridley Scott"],
          answer: "Steven Spielberg",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name a film directed by Christopher Nolan.",
          answer: ["Inception", "The Dark Knight"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Which director is known for 'The Godfather'?",
          choices: ["Francis Ford Coppola", "Martin Scorsese", "Quentin Tarantino", "Stanley Kubrick"],
          answer: "Francis Ford Coppola",
          bonus: 5
        }
      }
    },
    {
      topic: "Genres",
      degrees: {
        1: { 
          type: "mc",
          question: "What genre is 'The Lion King'?",
          choices: ["Animation", "Drama", "Comedy", "Action"],
          answer: "Animation",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "What genre is 'The Conjuring'?",
          answer: ["Horror"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a film in the crime genre.",
          choices: ["The Godfather", "Goodfellas", "Scarface", "Casino"],
          answer: "The Godfather",
          bonus: 5
        }
      }
    },
    {
      topic: "Actors",
      degrees: {
        1: { 
          type: "mc",
          question: "Who starred as Jack in 'Titanic'?",
          choices: ["Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp"],
          answer: "Leonardo DiCaprio",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Name a famous actor known for action movies.",
          answer: ["Arnold Schwarzenegger", "Sylvester Stallone"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Who is known as 'The King of Hollywood'?",
          choices: ["Clark Gable", "Humphrey Bogart", "James Dean", "Paul Newman"],
          answer: "Clark Gable",
          bonus: 5
        }
      }
    },
    {
      topic: "Film History",
      degrees: {
        1: { 
          type: "mc",
          question: "Who is considered the father of cinema?",
          choices: ["Georges Méliès", "Charlie Chaplin", "D.W. Griffith", "Sergei Eisenstein"],
          answer: "Georges Méliès",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "Which film movement is associated with the French New Wave?",
          answer: ["Nouvelle Vague", "French New Wave"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name an iconic film known for the line 'I'm gonna make him an offer he can't refuse'.",
          choices: ["The Godfather", "Goodfellas", "Scarface", "Casino"],
          answer: "The Godfather",
          bonus: 5
        }
      }
    }
  ],
  "Travel": [
    {
      topic: "European Travel",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Italy?",
          choices: ["Rome", "Milan", "Naples", "Florence"],
          answer: "Rome",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Italy located?",
          answer: ["Europe"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Italy.",
          choices: ["France", "Switzerland", "Austria", "Slovenia"],
          answer: "France",
          bonus: 5
        }
      }
    },
    {
      topic: "Asian Travel",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Japan?",
          choices: ["Tokyo", "Osaka", "Kyoto", "Hiroshima"],
          answer: "Tokyo",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Japan located?",
          answer: ["Asia"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Japan.",
          choices: ["South Korea", "China", "North Korea", "Russia"],
          answer: "South Korea",
          bonus: 5
        }
      }
    },
    {
      topic: "African Travel",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Egypt?",
          choices: ["Cairo", "Alexandria", "Giza", "Luxor"],
          answer: "Cairo",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Egypt located?",
          answer: ["Africa"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Egypt.",
          choices: ["Libya", "Sudan", "Israel", "Jordan"],
          answer: "Libya",
          bonus: 5
        }
      }
    },
    {
      topic: "North American Travel",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Canada?",
          choices: ["Ottawa", "Toronto", "Vancouver", "Montreal"],
          answer: "Ottawa",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Canada located?",
          answer: ["North America"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Canada.",
          choices: ["United States", "Mexico", "Greenland", "Russia"],
          answer: "United States",
          bonus: 5
        }
      }
    },
    {
      topic: "South American Travel",
      degrees: {
        1: { 
          type: "mc",
          question: "What is the capital of Brazil?",
          choices: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
          answer: "Brasília",
          bonus: 5
        },
        2: { 
          type: "fill",
          question: "On which continent is Brazil located?",
          answer: ["South America"],
          bonus: 10
        },
        3: { 
          type: "mc",
          question: "Name a country that borders Brazil.",
          choices: ["Argentina", "Colombia", "Peru", "Bolivia"],
          answer: "Argentina",
          bonus: 5
        }
      }
    }
  ]
};
