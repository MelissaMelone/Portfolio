"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Kleintierdaten. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Kleintierdaten werden in einer MongoDB abgelegt.
 */
export default class KleintiereService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._kleintiere = DatabaseFactory.database.collection("kleintiere");
    }

    /**
     * Kleintierdaten suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Kleintierdaten
     */
    async search(query) {
        let cursor = this._kleintiere.find(query, {
            sort: {
                name: 1,
                alter: 1,
                geschlecht: 1,
                zustand: 1,
                rasse: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Kleintierdatensatzes.
     *
     * @param {Object} kleintiere Zu speichernde Kleintierdaten
     * @return {Promise} Gespeicherte Kleintierdaten
     */
    async create(kleintiere) {
        kleintiere = kleintiere || {};

        let newKleintier = {
            name:       kleintiere.name|| "",
            alter:      kleintiere.alter  || "",
            geschlecht: kleintiere.geschlecht     || "",
            zustand:    kleintiere.zustand      || "",
            rasse:      kleintiere.rasse   || "",
        };

        let result = await this._kleintiere.insertOne(newKleintier);
        return await this._kleintiere.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Kleintierdatensatzes anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Kleintieres
     * @return {Promise} Gefundene Kleintierdaten
     */
    async read(id) {
        let result = await this._addresses.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Kleintierdatensatzes, durch Überschreiben einzelner Felder
     * oder des gesamten Kleintierobjekts (ohne die ID).
     *
     * @param {String} id ID des gesuchten Kleintieres
     * @param {[type]} kleintiere Zu speichernde Kleintierdaten
     * @return {Promise} Gespeicherte Kleintierdaten oder undefined
     */
    async update(id, kleintiere) {
        let oldKleintier = await this._kleintiere.findOne({_id: new ObjectId(id)});
        if (!oldKleintier) return;

        let updateDoc = {
            $set: {},
        }

        if (kleintiere.name)             updateDoc.$set.name        = kleintiere.name;
        if (kleintiere.alter)            updateDoc.$set.alter       = kleintiere.alter;
        if (kleintiere.geschlecht)       updateDoc.$set.geschlecht  = kleintiere.geschlecht;
        if (kleintiere.zustand)          updateDoc.$set.zustand     = kleintiere.zustand;
        if (kleintiere.rasse)            updateDoc.$set.rasse       = kleintiere.rasse;

        await this._kleintiere.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._kleintiere.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Kleintierdatensatzes anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Kleintiers
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._kleintiere.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
