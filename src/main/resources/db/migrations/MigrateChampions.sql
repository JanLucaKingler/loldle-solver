CREATE TABLE IF NOT EXISTS champions
(
    id           INTEGER PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    gender       VARCHAR(20),
    role         VARCHAR(50),
    species      VARCHAR(100),
    resource     VARCHAR(50),
    attack_type  VARCHAR(20),
    region       VARCHAR(100),
    release_year INTEGER
);

INSERT INTO champions (id, name, gender, role, species, resource, attack_type, region, release_year)
VALUES (1, 'Aatrox', 'Male', 'Top', 'Darkin', 'Manaless', 'Melee', 'Runeterra, Shurima', 2013),
       (2, 'Ahri', 'Female', 'Middle', 'Vastayan', 'Mana', 'Ranged', 'Ionia', 2011),
       (3, 'Akali', 'Female', 'Middle', 'Human', 'Energy', 'Melee', 'Ionia', 2010),
       (4, 'Akshan', 'Male', 'Middle', 'Human', 'Mana', 'Ranged', 'Shurima', 2021),
       (5, 'Alistar', 'Male', 'Support', 'Minotaur', 'Mana', 'Melee', 'Noxus, Runeterra', 2009),
       (6, 'Amumu', 'Male', 'Jungle', 'Undead, Yordle', 'Mana', 'Melee', 'Shurima', 2009),
       (7, 'Ambessa', 'Female', 'Top', 'Human', 'Energy', 'Melee', 'Noxus, Piltover', 2024),
       (8, 'Anivia', 'Female', 'Middle', 'God, Spirit', 'Mana', 'Ranged', 'Freljord', 2009),
       (9, 'Annie', 'Female', 'Middle', 'Human, Magicborn', 'Mana', 'Ranged', 'Noxus, Runeterra', 2009),
       (10, 'Aphelios', 'Male', 'Bottom', 'Human, Spiritualist', 'Mana', 'Ranged', 'Targon', 2019),
       (11, 'Ashe', 'Female', 'Bottom', 'Human, Iceborn', 'Mana', 'Ranged', 'Freljord', 2009),
       (12, 'Aurelion Sol', 'Male', 'Middle', 'Celestial, Dragon', 'Mana', 'Ranged', 'Runeterra, Targon', 2016),
       (13, 'Aurora', 'Female', 'Middle', 'Vastayan', 'Mana', 'Ranged', 'Freljord', 2024)
ON CONFLICT (id) DO NOTHING;