/**
 * Copyright (c) 2023 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const axios = require('axios');
const { assign: merge } = Object;
const { validateType } = require('./lib/utils');
const validator = require('./lib/validator');
const logger = require('debug-symbols')('qdrant');

class Qdrant {
    constructor(opts = {}) {
        validateType.object(opts, 'opts');

        this.opts = merge({ port: 6333, host: 'localhost' }, opts);

        this.#init();
    }

    #init() {
        if (this.axios) return;

        let { host, port } = this.opts;

        let baseURL = /^https?:\/\//.test(host) ? host : `http://` + host;

        baseURL += `:${port}`;

        // console.log(baseURL);

        this.axios = axios.create({
            baseURL,
            timeout: 30000,
            headers: { 'content-type': 'application/json' },
        });
    }

    #fetch(route, method = 'get', data = {}) {
        return this.axios[method](route, data)
            .then((resp) => resp.data)
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                // console.log(error.config);
                // console.log(method, route, JSON.stringify(data, 0, 4));
            });
    }

    get_collections() {
        logger.warn(`Fetching all collections list.`);
        return this.#fetch(`/collections`);
    }

    get_collection(collectionName) {
        validateType.string(collectionName, 'collectionName');
        logger.warn(`Fetching collection "${collectionName}" info.`);
        return this.#fetch(`/collections/${collectionName}`);
    }

    delete_collection(collectionName) {
        validateType.string(collectionName, 'collectionName');
        logger.warn(`Deleting collection "${collectionName}"`);
        return this.#fetch(`/collections/${collectionName}`, 'delete');
    }

    async recreate_collection(collectionSettings, recreateIfExists = false) {
        try {
            validator.validate('create-collection', collectionSettings);

            logger.info(`Creating collection "${collectionSettings.name}".`);

            if (recreateIfExists) {
                logger.warn(
                    `Note: Will delete "${collectionSettings.name}" if it already exists!`
                );

                let resp = await this.get_collections();
                let exists =
                    (resp?.result?.collections || []).filter(
                        (o) => o.name == collectionSettings.name
                    ).length > 0;

                if (exists) {
                    this.delete_collection(collectionSettings.name);
                }
            }

            return this.#fetch(
                `/collections/${collectionSettings.name}`,
                'put',
                collectionSettings
            );
        } catch (error) {
            throw error;
        }
    }

    upsert(collectionName, pointsData) {
        validateType.string(collectionName, 'collectionName');

        validator.validate('points-data', pointsData);

        logger.info(`Upserting ${pointsData.points.length} points...`);

        return this.#fetch(
            `/collections/${collectionName}/points`,
            'put',
            pointsData
        );
    }

    search(collectionName, queryData) {
        validateType.string(collectionName, 'collectionName');
        validator.validate('search-query', queryData);

        // console.log(queryData);
        // POST /collections/{collection_name}/points/search

        return this.#fetch(
            `/collections/${collectionName}/points/search`,
            'post',
            queryData
        ).then((resp) => {
            resp.meta = {
                hits: resp.result.length,
                scores:{
                    min: resp.result[resp.result.length-1]?.score,
                    max: resp.result[0]?.score
                },
                query: queryData,
            };
            return resp;
        });
    }
}

module.exports = Qdrant;
