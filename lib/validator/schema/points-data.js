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

const vectorSchema = {
    type: 'object',
    props: {
        size: 'number',
        distance: {
            type: 'string',
            enum: ['Cosine', 'Dot', 'Euclid'],
        },
    },
};

module.exports = {
    $$strict: 'remove',

    points: {
        type: 'array',
        items: {
            type: 'object',
            props: {
                id: {
                    type: 'multi',
                    rules: [
                        { type: 'number', positive: true, integer: true },
                        {
                            type: 'uuid',
                        },
                    ],
                },
                payload: {
                    type: 'object',
                    optional: true,
                },
                vector: {
                    type: 'multi',
                    rules: [
                        { type: 'array', items: 'number' },
                        {
                            type: 'record',
                            key: { type: 'string', alpha: true },
                            value: { type: 'array', items: 'number' }
                        },
                    ],
                    optional: true,
                },
            },
        },
    },
};
