﻿import { registerEditor } from "../../Decorators";
import { tryGetText } from "../../Q/LocalText";
import { Enum, getAttributes } from "../../Q/TypeSystem";
import { EnumKeyAttribute } from "../../Types/Attributes";
import { EnumTypeRegistry } from "../../Types/EnumTypeRegistry";
import { Select2CommonOptions, Select2Editor } from "./Select2Editor";

export interface EnumEditorOptions extends Select2CommonOptions {
    enumKey?: string;
    enumType?: any;
}

@registerEditor('Serenity.EnumEditor')
export class EnumEditor extends Select2Editor<EnumEditorOptions, Select2Item> {
    constructor(hidden: JQuery, opt: EnumEditorOptions) {
        super(hidden, opt);
        this.updateItems();
    }

    protected updateItems(): void {
        this.clearItems();

        var enumType = this.options.enumType || EnumTypeRegistry.get(this.options.enumKey);
        var enumKey = this.options.enumKey;

        if (enumKey == null && enumType != null) {
            var enumKeyAttr = getAttributes(enumType, EnumKeyAttribute, false);
            if (enumKeyAttr.length > 0) {
                enumKey = enumKeyAttr[0].value;
            }
        }

        var values = Enum.getValues(enumType);
        for (var x of values) {
            var name = Enum.toString(enumType, x);
            this.addOption(parseInt(x, 10).toString(),
                (tryGetText('Enums.' + enumKey + '.' + name) ?? name), null, false);
        }
    }

    protected allowClear() {
        return (this.options.allowClear ?? true);
    }
}