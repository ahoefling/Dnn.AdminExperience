import React, {Component, PropTypes} from "react";
import Localization from "../../../localization";
import Collapse from "dnn-collapsible";
import GridCell from "dnn-grid-cell";
import Button from "dnn-button";
import RadioButtons from "dnn-radio-buttons";
import Label from "dnn-label";
import Dropdown from "dnn-dropdown";
import SingleLineInputWithError from "dnn-single-line-input-with-error";

const portalAliasUsageType = {
    Default: 0,
    ChildPagesInherit: 1,
    ChildPagesDoNotInherit: 2,
    InheritedFromParent: 3
};

class EditUrl extends Component {
    onChangeField(key, event) {
        const {onChange} = this.props;
        let value = event;
        if (event.value) {
            value = event.value;
        }  else if (event.target) {
            value = event.target.value;
        }
        
        onChange(key, value);
    }
    
    getUrlTypeOptions() {
        return [
            {
                label: "Active (200)",
                value: 200
            },
            {
                label: "Redirect (301)",
                value: 301
            }
        ];
    }
    
    getOptions(siteAliases) {
        return siteAliases.map(alias => {
            return {
                label: alias.Value,
                value: alias.Key
            };
        });
    }
    
    getSiteAliasUsageOptions(hasParent) {
        let options = [
            {value: portalAliasUsageType.ChildPagesDoNotInherit, label: Localization.get("Pages_Seo_SelectedAliasUsageOptionThisPageOnly")}, 
            {value: portalAliasUsageType.ChildPagesInherit, label: Localization.get("Pages_Seo_SelectedAliasUsageOptionPageAndChildPages")}
        ];
                       
        if (hasParent) {
            options.push({
                value: portalAliasUsageType.InheritedFromParent, label: Localization.get("Pages_Seo_SelectedAliasUsageOptionSameAsParent")
            });
        }
        
        return options;
    }
    
    render() {
        const {url, saving, pageHasParent, siteAliases, primaryAliasId, isOpened, onSave, onCancel} = this.props;
        const aliases = this.getOptions(siteAliases);
        const siteAliasUsageOptions = this.getSiteAliasUsageOptions(pageHasParent);
        return (
            <Collapse accordion={true} isOpened={isOpened} keepCollapsedContent={true} className="editUrl">
                <GridCell>
                    <GridCell columnSize="30">
                        <Label
                            labelType="block"
                            tooltipMessage={Localization.get("Pages_Seo_SiteAlias.Help")}
                            label={Localization.get("Pages_Seo_SiteAlias")} />
                        <Dropdown options={aliases} style={{width: "90%"}}
                            value={url.siteAlias.Key} 
                            onSelect={this.onChangeField.bind(this, "siteAlias")} 
                            withBorder={true} />
                    </GridCell>
                    <GridCell columnSize="70">
                        <SingleLineInputWithError style={{width: "90%"}}
                            label={Localization.get("Pages_Seo_UrlPath")}
                            tooltipMessage={Localization.get("Pages_Seo_UrlPath.Help")}
                            value={url.path} 
                            onChange={this.onChangeField.bind(this, "path")} />
                    </GridCell>
                </GridCell>
                {url.siteAlias.Key !== primaryAliasId &&
                <GridCell>
                    <GridCell columnSize="100">
                        <Label
                            labelType="block"
                            tooltipMessage={Localization.get("Pages_Seo_SelectedAliasUsage.Help")}
                            label={Localization.get("Pages_Seo_SelectedAliasUsage")} />
                        <RadioButtons style={{width: "90%"}}
                                options={siteAliasUsageOptions} 
                                onChange={this.onChangeField.bind(this, "siteAliasUsage")}
                                value={url.siteAliasUsage}/>                        
                    </GridCell>
                </GridCell>}
                <GridCell>
                    <GridCell columnSize="30">
                        <Label
                            labelType="block"
                            tooltipMessage={Localization.get("Pages_Seo_UrlType.Help")}
                            label={Localization.get("Pages_Seo_UrlType")} />
                        <Dropdown options={this.getUrlTypeOptions()} style={{width: "90%"}}
                            value={url.statusCode.Key} 
                            onSelect={this.onChangeField.bind(this, "statusCode")} 
                            withBorder={true} />
                    </GridCell>
                    <GridCell columnSize="70">
                        {url.statusCode.Key === 301 && 
                        <SingleLineInputWithError
                            style={{width: "90%"}}
                            label={Localization.get("Pages_Seo_QueryString")}
                            tooltipMessage={Localization.get("Pages_Seo_QueryString.Help")}
                            value={url.queryString} 
                            onChange={this.onChangeField.bind(this, "queryString")} />}
                    </GridCell>
                </GridCell>
                <div className="buttons-box" style={{float: "left"}}>
                    <Button type="secondary" onClick={onCancel} disabled={saving}>
                        {Localization.get("Cancel")}
                    </Button>
                    <Button type="primary" onClick={onSave} disabled={saving}>
                        {Localization.get("Save")}
                    </Button>
                </div>
            </Collapse>
        );
    }
}

EditUrl.propTypes = {
    url: PropTypes.object.isRequired,
    siteAliases: PropTypes.arrayOf(PropTypes.object).isRequired,
    primaryAliasId: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    isOpened: PropTypes.bool,
    pageHasParent: PropTypes.bool,
    className: PropTypes.string, 
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    saving: PropTypes.bool
};

export default EditUrl;