const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'polkarzyk';

const dokument1 = {
    id: 0,
    name: "Biedronka",
    location: "54.35126275796481, 18.654804568859817",
    groups: [
        {
            name: "Piętro 1",
            categories: [
                {
                    name: "Nabiał",
                    x: 10,
                    y: 20,
                    width: 120,
                    height: 60,
                    products: [
                        {
                            name: "Mleko",
                            tags: ['polskie-mleko', 'bio']
                        },
                        {
                            name: "Ser",
                            tags: ['ser-gouda', 'ser-zolty']
                        }
                    ]
                },
                {
                    name: "Warzywa",
                    x: 30,
                    y: 40,
                    width: 100,
                    height: 70,
                    products: [
                        {
                            name: "Marchewka",
                            tags: ['marchew', 'bio']
                        },
                        {
                            name: "Pomidory",
                            tags: ['pomidor', 'warzywa']
                        }
                    ]
                },
                {
                    name: "Pieczywo",
                    x: 50,
                    y: 60,
                    width: 80,
                    height: 50,
                    products: [
                        {
                            name: "Chleb razowy",
                            tags: ['chleb', 'razowy']
                        },
                        {
                            name: "Bułki",
                            tags: ['bułki', 'świeże']
                        }
                    ]
                }
            ]
        }
    ]
};

const dokument2 = {
    id: 0,
    name: "Lidl",
    location: "54.347633022458794, 18.670118700796294",
    groups: [
        {
            name: "Piętro 1",
            categories: [
                {
                    name: "Napoje",
                    x: 20,
                    y: 30,
                    width: 100,
                    height: 80,
                    products: [
                        {
                            name: "Woda mineralna",
                            tags: ['woda', 'mineralna']
                        },
                        {
                            name: "Soki",
                            tags: ['soki', 'owocowe']
                        }
                    ]
                },
                {
                    name: "Słodycze",
                    x: 40,
                    y: 50,
                    width: 90,
                    height: 60,
                    products: [
                        {
                            name: "Czekolada",
                            tags: ['czekolada', 'mleczna']
                        },
                        {
                            name: "Cukierki",
                            tags: ['cukierki', 'owoce']
                        }
                    ]
                },
                {
                    name: "Artykuły gospodarcze",
                    x: 60,
                    y: 70,
                    width: 110,
                    height: 40,
                    products: [
                        {
                            name: "Ręczniki papierowe",
                            tags: ['ręczniki', 'papierowe']
                        },
                        {
                            name: "Worki na śmieci",
                            tags: ['worki', 'śmieciowe']
                        }
                    ]
                }
            ]
        },
        {
            name: "Piętro 2",
            categories: [
                {
                    name: "Żywność mrożona",
                    x: 30,
                    y: 40,
                    width: 120,
                    height: 70,
                    products: [
                        {
                            name: "Lody",
                            tags: ['lody', 'waniliowe']
                        },
                        {
                            name: "Mrożonki obiadowe",
                            tags: ['mrożonki', 'obiadowe']
                        }
                    ]
                },
                {
                    name: "Artykuły drogeryjne",
                    x: 50,
                    y: 60,
                    width: 100,
                    height: 50,
                    products: [
                        {
                            name: "Szampon",
                            tags: ['szampon', 'nawilżający']
                        },
                        {
                            name: "Pasta do zębów",
                            tags: ['pasta', 'do zębów']
                        }
                    ]
                }
            ]
        }
    ]
};

const dokument3 = {
    id: 0,
    name: "Carrefour Express",
    location: "54.34758271621173, 18.65842174947762",
    groups: [
        {
            name: "Piętro 1",
            categories: [
                {
                    name: "Żywność gotowa",
                    x: 15,
                    y: 25,
                    width: 80,
                    height: 70,
                    products: [
                        {
                            name: "Pierogi ruskie",
                            tags: ['pierogi', 'ruskie']
                        },
                        {
                            name: "Kotlet schabowy",
                            tags: ['kotlet', 'schabowy']
                        }
                    ]
                },
                {
                    name: "Napoje alkoholowe",
                    x: 35,
                    y: 45,
                    width: 70,
                    height: 60,
                    products: [
                        {
                            name: "Piwo",
                            tags: ['piwo', 'lager']
                        },
                        {
                            name: "Wino",
                            tags: ['wino', 'czerwone']
                        }
                    ]
                },
                {
                    name: "Artykuły higieniczne",
                    x: 55,
                    y: 65,
                    width: 90,
                    height: 50,
                    products: [
                        {
                            name: "Pasta do zębów",
                            tags: ['pasta', 'zębów']
                        },
                        {
                            name: "Mydło",
                            tags: ['mydło', 'antybakteryjne']
                        }
                    ]
                }
            ]
        }
    ]
};

async function insertData() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to the database');

        const db = client.db(dbName);
        const collection = db.collection('shops');

        const result = await collection.insertMany([dokument1, dokument2, dokument3])
        console.log(result)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await client.close();
        console.log('Connection closed')
    }
}

insertData();
