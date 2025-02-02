// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InjectionFailedWarning,
    InjectionFailedWarningProps,
} from 'DetailsView/components/injection-failed-warning';
import {
    ScanIncompleteWarning,
    ScanIncompleteWarningProps,
} from 'DetailsView/components/scan-incomplete-warning';
import * as React from 'react';

export type BannerWarningsProps = ScanIncompleteWarningProps & InjectionFailedWarningProps;

export class BannerWarnings extends React.PureComponent<BannerWarningsProps> {
    public render() {
        return (
            <>
                <ScanIncompleteWarning
                    deps={this.props.deps}
                    warnings={this.props.warnings}
                    warningConfiguration={this.props.warningConfiguration}
                    test={this.props.test}
                />
                <InjectionFailedWarning
                    visualizationStoreData={this.props.visualizationStoreData}
                />
            </>
        );
    }
}
