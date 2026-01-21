/**
 * Represents a JSON Schema (draft 2020-12).
 * @see https://json-schema.org/draft/2020-12/schema
 */
export interface JSONSchema {
    /** The schema URI */
    $schema?: string;
    /** The local ID for this schema */
    $id?: string;
    /** The title of the schema */
    title?: string;
    /** A description for the schema */
    description?: string;
    /** The type of data this schema describes */
    type?: string | string[];
    /** Properties for 'object' types */
    properties?: Record<string, JSONSchema>;
    /** Required properties for 'object' types */
    required?: string[];
    /** Schema for additional properties */
    additionalProperties?: boolean | JSONSchema;
    /** Reference to another schema */
    $ref?: string;
    /** Enum of allowed values */
    enum?: any[];
    /** Default value for the property */
    default?: any;
}

/**
 * A schema for a custom Catalog Description including A2UI components and styles.
 */
export interface CatalogDescription {
    /**
     * A string that uniquely identifies this catalog.
     * It is recommended to prefix this with an internet domain that you own,
     * to avoid conflicts e.g. 'mycompany.com:somecatalog'.
     */
    catalogId: string;

    /**
     * A schema that defines a catalog of A2UI components.
     * Each key is a component name, and each value is the JSON schema for that component's properties.
     */
    components: Record<string, JSONSchema>;

    /**
     * A schema that defines a catalog of A2UI styles.
     * Each key is a style name, and each value is the JSON schema for that style's properties.
     */
    styles: Record<string, JSONSchema>;
}
