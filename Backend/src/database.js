"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("Tierauffangsstationdatenverwaltung");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        let kleintiere = this.database.collection("kleintiere");

        if (await kleintiere.estimatedDocumentCount() === 0) {
            kleintiere.insertMany([
                {
                    name: "Bello",
                    alter: "4",
                    geschlecht: "male",
                    zustand: "gut",
                    rasse: "Hund",
                },
                {
                    name: "Mieze",
                    alter: "5",
                    geschlecht: "female",
                    zustand: "krank",
                    rasse: "Katze",
                },
                {
                    name: "Jürgen",
                    alter: "2",
                    geschlecht: "male",
                    zustand: "mittel",
                    rasse: "Vogel",
                },
                {
                    name: "Selma",
                    alter: "9",
                    geschlecht: "female",
                    zustand: "alt",
                    rasse: "Hund",
                },
                {
                    name: "Kitty",
                    alter: "4",
                    geschlecht: "female",
                    zustand: "fit",
                    rasse: "Kaninchen",
                },
            ]);
        }
    }
}

export default new DatabaseFactory();
