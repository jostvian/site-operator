import type { CatalogDescription, JSONSchema } from './a2ui.types.js';

/**
 * A standard JSON Schema for A2UI Catalog Descriptions.
 */
const catalogSchema: JSONSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'A2UI Catalog Description Schema',
    description: 'A schema for a custom Catalog Description including A2UI components and styles.',
    type: 'object',
    properties: {
        catalogId: {
            title: 'Catalog ID',
            description: "A string that uniquely identifies this catalog. It is recommended to prefix this with an internet domain that you own, to avoid conflicts e.g. 'mycompany.com:somecatalog'.",
            type: 'string',
        },
        components: {
            title: 'A2UI Components',
            description: "A schema that defines a catalog of A2UI components. Each key is a component name, and each value is the JSON schema for that component's properties.",
            type: 'object',
            additionalProperties: {
                $ref: 'https://json-schema.org/draft/2020-12/schema',
            },
        },
        styles: {
            title: 'A2UI Styles',
            description: "A schema that defines a catalog of A2UI styles. Each key is a style name, and each value is the JSON schema for that style's properties.",
            type: 'object',
            additionalProperties: {
                $ref: 'https://json-schema.org/draft/2020-12/schema',
            },
        },
    },
    required: ['catalogId', 'components', 'styles'],
};

/**
 * Standard A2UI Catalog implementation.
 */
export const standardCatalog: CatalogDescription = {
    catalogId: 'a2ui.standard',
    components: {},
    styles: {},
};

/**
 * Gets the standard catalog schema.
 * @returns {JSONSchema} The A2UI Catalog Description Schema.
 */
export function getStandardCatalogSchema(): JSONSchema {
    return catalogSchema;
}
