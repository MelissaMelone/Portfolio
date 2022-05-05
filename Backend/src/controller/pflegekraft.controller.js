"use strict"

import PflegekraftService from "../service/pflegekraft.service.js";
import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für Pflegekraftdateneinträge.
 */
export default class PflegekraftController {
    
    constructor(server, prefix) {
        this._service = new PflegekraftService();
        this._prefix = prefix;

        // Collection: Pflegekraefte
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Pflegekraft
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    //Einfügen von HATEOAS-Links in einen Datensatz.

    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read:   {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch:  {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"},
        }
    }

    
    //GET /pflegekraft

    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.sendResult(result);
        return next();
    }

    
    //POST /pflegekraft

    async create(req, res, next) {
        let result = await this._service.create(req.body);
        this._insertHateoasLinks(result);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);

        return next();
    }

    
    //GET /pflegekraft/:id

    async read(req, res, next) {
        let result = await this._service.read(req.params.id);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Pflegekraft nicht gefunden");
        }

        return next();
    }


    //PUT /pflegekraft/:id
    //PATCH /pflegekraft/:id
    
    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Pflegekraft nicht gefunden");
        }

        return next();
    }

    
    //DELETE /pflegekraft/:id
 
    async delete(req, res, next) {
        await this._service.delete(req.params.id)
        res.status(204);
        res.sendResult({});
        return next();
    }
}
