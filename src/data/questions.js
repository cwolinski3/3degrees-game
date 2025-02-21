export const questions = {
  // History Category: 5 Topics
  "History": [
    {
      topic: "American Revolution",
      degrees: {
        1: [ 
          { 
            type: "mc",
            question: "What is the capital of Massachusetts (a key city during the American Revolution)?",
            choices: ["Boston", "Providence", "Hartford", "Albany"],
            answer: "Boston",
            bonus: 5
          }
        ],
        2: [ 
          { 
            type: "fill",
            question: "Name one major battle of the American Revolution.",
            answer: ["Bunker Hill", "Lexington", "Concord"],
            bonus: 10
          }
        ],
        3: [ 
          { 
            type: "mc",
            question: "Who was the commander-in-chief of the Continental Army?",
            choices: ["George Washington", "John Adams", "Benjamin Franklin", "Thomas Jefferson"],
            answer: "George Washington",
            bonus: 5
          }
        ]
      }
    },
    {
      topic: "Ancient Rome",
      degrees: {
        1: [ 
          { 
            type: "mc",
            question: "What is the capital of ancient Rome?",
            choices: ["Rome", "Athens", "Carthage", "Alexandria"],
            answer: "Rome",
            bonus: 5
          }
        ],
        2: [ 
          { 
            type: "fill",
            question: "Name one famous Roman emperor.",
            answer: ["Augustus", "Nero", "Caligula", "Marcus Aurelius"],
            bonus: 10
          }
        ],
        3: [ 
          { 
            type: "mc",
            question: "Which Roman structure hosted gladiatorial contests?",
            choices: ["Colosseum", "Pantheon", "Forum", "Circus Maximus"],
            answer: "Colosseum",
            bonus: 5
          }
        ]
      }
    },
    {
      topic: "Medieval Europe",
      degrees: {
        1: [ 
          { 
            type: "mc",
            question: "What period is known as the Middle Ages?",
            choices: ["Middle Ages", "Dark Ages", "Feudal Age", "Medieval Period"],
            answer: "Middle Ages",
            bonus: 5
          }
        ],
        2: [ 
          { 
            type: "fill",
            question: "Which document, signed in 1215, limited the power of the English king?",
            answer: ["Magna Carta"],
            bonus: 10
          }
        ],
        3: [ 
          { 
            type: "mc",
            question: "Name a famous medieval castle in England.",
            choices: ["Windsor Castle", "Leeds Castle", "Warwick Castle", "Bamburgh Castle"],
            answer: "Windsor Castle",
            bonus: 5
          }
        ]
      }
    },
    {
      topic: "World War I",
      degrees: {
        1: [ 
          { 
            type: "mc",
            question: "In what year did World War I begin?",
            choices: ["1912", "1914", "1916", "1918"],
            answer: "1914",
            bonus: 5
          }
        ],
        2: [ 
          { 
            type: "fill",
            question: "What event sparked World War I?",
            answer: ["Assassination of Archduke Franz Ferdinand"],
            bonus: 10
          }
        ],
        3: [ 
          { 
            type: "mc",
            question: "Which treaty ended World War I?",
            choices: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Trianon", "Treaty of Brest-Litovsk"],
            answer: "Treaty of Versailles",
            bonus: 5
          }
        ]
      }
    },
    {
      topic: "World War II",
      degrees: {
        1: [ 
          { 
            type: "mc",
            question: "In what year did World War II begin?",
            choices: ["1937", "1939", "1941", "1943"],
            answer: "1939",
            bonus: 5
          }
        ],
        2: [ 
          { 
            type: "fill",
            question: "Which battle marked a turning point on the Eastern Front?",
            answer: ["Battle of Stalingrad"],
            bonus: 10
          }
        ],
        3: [ 
          { 
            type: "mc",
            question: "What was the codename for the Allied invasion of Normandy?",
            choices: ["Operation Overlord", "Operation Torch", "Operation Market Garden", "Operation Neptune"],
            answer: "Operation Overlord",
            bonus: 5
          }
        ]
      }
    }
  ],
  
  // Science Category (Placeholder - Expand similarly with 5 topics)
  "Science": [
    {
      topic: "Space Exploration",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "Which planet is known as the Red Planet?",
            choices: ["Mars", "Venus", "Jupiter", "Saturn"],
            answer: "Mars",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "Who was the first human in space?",
            answer: ["Yuri Gagarin"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "What is the name of NASA's space telescope launched in 1990?",
            choices: ["Hubble", "Chandra", "Spitzer", "Kepler"],
            answer: "Hubble",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Science here...
  ],
  
  // Geography Category (Placeholder - Expand similarly with 5 topics)
  "Geography": [
    {
      topic: "European Capitals",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "What is the capital of France?",
            choices: ["Paris", "Berlin", "Madrid", "Rome"],
            answer: "Paris",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "On which continent is France located?",
            answer: ["Europe"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "Name a country that borders France.",
            choices: ["Spain", "Germany", "Italy", "Belgium"],
            answer: "Spain",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Geography here...
  ],
  
  // Math Category (Placeholder - Expand similarly with 5 topics)
  "Math": [
    {
      topic: "Basic Arithmetic",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "What is 2 + 2?",
            choices: ["4", "3", "5", "6"],
            answer: "4",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "What is 10 - 3?",
            answer: ["7"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "What is 3 x 3?",
            choices: ["9", "6", "12", "15"],
            answer: "9",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Math here...
  ],
  
  // Literature Category (Placeholder - Expand similarly with 5 topics)
  "Literature": [
    {
      topic: "Shakespeare",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "Who wrote 'Romeo and Juliet'?",
            choices: ["William Shakespeare", "Christopher Marlowe", "Ben Jonson", "John Milton"],
            answer: "William Shakespeare",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "Name one tragedy by Shakespeare.",
            answer: ["Hamlet", "Macbeth", "Othello", "King Lear"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "Which play features the character Prospero?",
            choices: ["The Tempest", "Much Ado About Nothing", "Twelfth Night", "As You Like It"],
            answer: "The Tempest",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Literature here...
  ],
  
  // Sports Category (Placeholder - Expand similarly with 5 topics)
  "Sports": [
    {
      topic: "Soccer",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "How many players are on a soccer team on the field?",
            choices: ["11", "10", "9", "12"],
            answer: "11",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "Which country won the 2018 FIFA World Cup?",
            answer: ["France"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "Name a famous Spanish soccer team.",
            choices: ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla"],
            answer: ["Real Madrid", "Barcelona"],
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Sports here...
  ],
  
  // Music Category (Placeholder - Expand similarly with 5 topics)
  "Music": [
    {
      topic: "Pop Music",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "Who is known as the King of Pop?",
            choices: ["Michael Jackson", "Prince", "Elvis", "Madonna"],
            answer: "Michael Jackson",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "Which pop star released the album 'Thriller'?",
            answer: ["Michael Jackson"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "Name a hit single by Madonna.",
            choices: ["Like a Virgin", "Material Girl", "Vogue", "Papa Don't Preach"],
            answer: "Like a Virgin",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Music here...
  ],
  
  // Art Category (Placeholder - Expand similarly with 5 topics)
  "Art": [
    {
      topic: "Renaissance",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "Who painted the Mona Lisa?",
            choices: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"],
            answer: "Leonardo da Vinci",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "Which artist sculpted 'David'?",
            answer: ["Michelangelo"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "Name a key work by Raphael.",
            choices: ["The School of Athens", "The Last Supper", "The Creation of Adam", "The Birth of Venus"],
            answer: "The School of Athens",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Art here...
  ],
  
  // Technology Category (Placeholder - Expand similarly with 5 topics)
  "Technology": [
    {
      topic: "Computing",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "What does CPU stand for?",
            choices: ["Central Processing Unit", "Computer Personal Unit", "Central Performance Unit", "Central Processing Utility"],
            answer: "Central Processing Unit",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "What is the primary language for web development?",
            answer: ["JavaScript"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "Which company created the iPhone?",
            choices: ["Apple", "Samsung", "Google", "Microsoft"],
            answer: "Apple",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Technology here...
  ],
  
  // Politics Category (Placeholder - Expand similarly with 5 topics)
  "Politics": [
    {
      topic: "US Politics",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "Who is the current President of the United States (as of 2021)?",
            choices: ["Joe Biden", "Donald Trump", "Barack Obama", "George W. Bush"],
            answer: "Joe Biden",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "What branch of the US government makes the laws?",
            answer: ["Legislative"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "What is the upper chamber of the US Congress called?",
            choices: ["Senate", "House", "Congress", "Supreme Court"],
            answer: "Senate",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Politics here...
  ],
  
  // Movies Category (Placeholder - Expand similarly with 5 topics)
  "Movies": [
    {
      topic: "Blockbusters",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "Which film features Darth Vader?",
            choices: ["Star Wars", "Star Trek", "Blade Runner", "The Matrix"],
            answer: "Star Wars",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "What film is known for its alien invasion plot?",
            answer: ["Independence Day"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "Name the highest-grossing film (as of 2021).",
            choices: ["Avatar", "Titanic", "Star Wars", "Avengers: Endgame"],
            answer: "Avatar",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Movies here...
  ],
  
  // Travel Category (Placeholder - Expand similarly with 5 topics)
  "Travel": [
    {
      topic: "European Travel",
      degrees: {
        1: [
          { 
            type: "mc",
            question: "What is the capital of Italy?",
            choices: ["Rome", "Milan", "Naples", "Florence"],
            answer: "Rome",
            bonus: 5
          }
        ],
        2: [
          { 
            type: "fill",
            question: "On which continent is Italy located?",
            answer: ["Europe"],
            bonus: 10
          }
        ],
        3: [
          { 
            type: "mc",
            question: "Name a country that borders Italy.",
            choices: ["France", "Switzerland", "Austria", "Slovenia"],
            answer: "France",
            bonus: 5
          }
        ]
      }
    },
    // Add 4 more topics for Travel here...
  ]
};
