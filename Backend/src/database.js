"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann.
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("Tierauffangsstationdatenverwaltung");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten.
     */
    async _createDemoData() {
        let kleintiere = this.database.collection("kleintiere");
        let pflegekraft = this.database.collection("pflegekraft");

        if (await kleintiere.estimatedDocumentCount() === 0) {
            kleintiere.insertMany([
                {
                    name: "Bello",
                    alter: "4",
                    geschlecht: "männlich",
                    zustand: "Fieber",
                    rasse: "Hund",
                },
                {
                    name: "Mieze",
                    alter: "5",
                    geschlecht: "weiblich",
                    zustand: "gebrochenes Bein",
                    rasse: "Katze",
                },
                {
                    name: "Jürgen",
                    alter: "2",
                    geschlecht: "männlich",
                    zustand: "Flohbefall",
                    rasse: "Vogel",
                },
                {
                    name: "Selma",
                    alter: "9",
                    geschlecht: "weiblich",
                    zustand: "Durchfall",
                    rasse: "Hund",
                },
                {
                    name: "Stella",
                    alter: "4",
                    geschlecht: "weiblich",
                    zustand: "",
                    rasse: "Kaninchen",
                },
            ]);
        }

        if (await pflegekraft.estimatedDocumentCount() === 0) {
            pflegekraft.insertMany([
                {
                    vorname: "Sabine",
                    nachname: "Müller",
                    rolle: "Facharzt",
                    eMail: "sabine@müller.de"
                },
                {
                    vorname: "Rainer",
                    nachname: "Zufall",
                    rolle: "Sekretär",
                    eMail: "rainer@zufall.de"
                },
                {
                    vorname: "Marie",
                    nachname: "Joanna",
                    rolle: "Praktikant",
                    eMail: "marie.joanna@web.de"
                },
                {
                    vorname: "Max",
                    nachname: "Müller",
                    rolle: "Pfleger",
                    eMail: "sabine@müller.de"
                },
            ]);
        }
    }
}

export default new DatabaseFactory();
