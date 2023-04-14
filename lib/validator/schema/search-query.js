// Copyright 2021 Anthony Mugendi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
"filter": {
        "must": [
            {
                "key": "city",
                "match": {
                    "value": "London"
                }
            }
        ]
    },
    "params": {
        "hnsw_ef": 128,
        "exact": false
    },
    "vector": [0.2, 0.1, 0.9, 0.7],
    "limit": 3
*/

const vectorSchema = {
    type: 'array',
    items: 'number',
};

// [{ key: 'tags', value: ['vocal'] }]

const filterSchema = {
    type: 'array',
    optional: true,
    items: {
        type: 'multi',
        rules: [
            {
                type: 'object',
                props: {
                    key: 'string',
                    match: {
                        type: 'object',
                        props: {
                            value: 'any',
                        },
                    },
                },
            },
            {
                type: 'object',
                props: {
                    key: 'string',
                    match: {
                        type: 'object',
                        props: {
                            any: {
                                type: 'array',
                                items: 'any',
                            },
                        },
                    },
                },
            },
            {
                type: 'object',
                props: {
                    key: 'string',
                    match: {
                        type: 'object',
                        props: {
                            text: 'string',
                        },
                    },
                },
            },
            {
                type: 'object',
                props: {
                    key: 'string',
                    range: {
                        type: 'object',
                        minProps: 1,
                        props: {
                            gt: { type: 'number', optional: true },
                            gte: { type: 'number', optional: true },
                            lt: { type: 'number', optional: true },
                            lte: { type: 'number', optional: true },
                        },
                    },
                },
            },
            {
                type: 'object',
                props: {
                    key: 'string',
                    values_count: {
                        type: 'object',
                        minProps: 1,
                        props: {
                            gt: { type: 'number', optional: true },
                            gte: { type: 'number', optional: true },
                            lt: { type: 'number', optional: true },
                            lte: { type: 'number', optional: true },
                        },
                    },
                },
            },
            {
                type: 'object',
                props: {
                    has_id: {
                        type: 'array',
                        items: [
                            { type: 'number', positive: true, integer: true },
                            {
                                type: 'uuid',
                            },
                        ],
                    },
                },
            },

            // TODO: ADD GEO
        ],
    },
};

module.exports = {
    $$strict: 'remove',

    limit: {
        type: 'number',
        optional: true,
        default: 5,
    },

    vector: {
        type: 'multi',
        rules: [
            vectorSchema,
            {
                type: 'object',
                strict: 'remove',
                props: {
                    vector: vectorSchema,
                    name: 'string',
                },
            },
        ],
        optional: true,
    },

    params: {
        type: 'object',
        optional: true,
        strict: 'remove',
        props: {
            hnsw_ef: 'number',
            exact: 'boolean',
        },
    },

    with_vectors: {
        type: 'boolean',
        optional: true,
        default: false,
    },
    with_payload: { type: 'boolean', optional: true, default: true },

    filter: {
        type: 'object',
        optional: true,
        strict: 'remove',
        props: {
            must: filterSchema,
            must_not: filterSchema,
            should: filterSchema,
            is_empty: {
                type: 'object',
                optional: true,
                props: {
                    key: 'string',
                },
            },
            is_null: {
                type: 'object',
                optional: true,
                props: {
                    key: 'string',
                },
            },
        },
    },
};
