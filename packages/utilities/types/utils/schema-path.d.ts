export = SchemaPath;
/**
 * @private
 */
declare class SchemaPath extends Array<any> {
    constructor(physical: any, logical?: any[]);
    logical: readonly any[];
    withProperty(name: any): SchemaPath;
    withAdditionalProperty(): SchemaPath;
    withPatternProperty(pattern: any): SchemaPath;
    withArrayItem(): SchemaPath;
    withApplicator(applicator: any, index: any): SchemaPath;
    withNot(): SchemaPath;
}
//# sourceMappingURL=schema-path.d.ts.map