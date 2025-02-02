// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import {
    TabStopsRequirementsWithInstances,
    TabStopsRequirementsWithInstancesDeps,
    TabStopsRequirementsWithInstancesProps,
} from 'DetailsView/tab-stops-requirements-with-instances';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock } from 'typemoq';

describe('TabStopsRequirementsWithInstances', () => {
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;
    let tabStopsRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let tabStopsTestViewControllerMock: IMock<TabStopsTestViewController>;
    const CollapsibleControlStub = getCollapsibleControlStub();
    let depsStub: TabStopsRequirementsWithInstancesDeps;
    let props: TabStopsRequirementsWithInstancesProps;
    let getCollapsibleComponentPropsWithInstance: (
        result: TabStopsRequirementResult,
        idx: number,
        buttonAriaLabel: string,
    ) => CollapsibleComponentCardsProps;
    beforeEach(() => {
        tabStopsFailedCounterMock = Mock.ofType<TabStopsFailedCounter>();
        tabStopsRequirementActionMessageCreatorMock = Mock.ofType(
            TabStopRequirementActionMessageCreator,
        );
        tabStopsTestViewControllerMock = Mock.ofType(TabStopsTestViewController);
        getCollapsibleComponentPropsWithInstance = (result, idx, button) => {
            return {
                id: result.id + idx + button,
                headingLevel: 3,
            } as CollapsibleComponentCardsProps;
        };
        depsStub = {
            collapsibleControl: (props: CollapsibleComponentCardsProps) => (
                <CollapsibleControlStub {...props} />
            ),
            tabStopsFailedCounter: tabStopsFailedCounterMock.object,
            tabStopsTestViewController: tabStopsTestViewControllerMock.object,
            tabStopRequirementActionMessageCreator:
                tabStopsRequirementActionMessageCreatorMock.object,
        } as TabStopsRequirementsWithInstancesDeps;

        props = {
            deps: depsStub,
            headingLevel: 3,
            getCollapsibleComponentPropsWithInstance,
            results: [
                {
                    id: 'keyboard-navigation',
                    description: 'test requirement description 1',
                    name: 'test requirement name 1',
                    instances: [{ id: 'test-id-1', description: 'test desc 1' }],
                    isExpanded: false,
                },
                {
                    id: 'keyboard-traps',
                    description: 'test requirement description 2',
                    name: 'test requirement name 2',
                    instances: [{ id: 'test-id-2', description: 'test desc 2' }],
                    isExpanded: false,
                },
            ] as TabStopsRequirementResult[],
        } as TabStopsRequirementsWithInstancesProps;
    });

    it('renders when instance count > 0', () => {
        tabStopsFailedCounterMock
            .setup(m => m.getTotalFailedByRequirementId(It.isAny(), It.isAny()))
            .returns(() => 2);
        const wrapper = shallow(<TabStopsRequirementsWithInstances {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders empty div when instance count === 0', () => {
        tabStopsFailedCounterMock
            .setup(m => m.getTotalFailedByRequirementId(It.isAny(), It.isAny()))
            .returns(() => 0);
        tabStopsFailedCounterMock
            .setup(m => m.getFailedInstancesByRequirementId(It.isAny(), It.isAny()))
            .returns(() => 0);
        const wrapper = shallow(<TabStopsRequirementsWithInstances {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders component instance count === 0', () => {
        tabStopsFailedCounterMock
            .setup(m => m.getTotalFailedByRequirementId(It.isAny(), It.isAny()))
            .returns(() => 0);
        tabStopsFailedCounterMock
            .setup(m => m.getFailedInstancesByRequirementId(It.isAny(), It.isAny()))
            .returns(() => 0);
        props.getCollapsibleComponentPropsWithoutInstance = (result, idx, button) => {
            return {
                id: result.id + idx + button,
                headingLevel: 3,
            } as CollapsibleComponentCardsProps;
        };
        const wrapper = shallow(<TabStopsRequirementsWithInstances {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    function getCollapsibleControlStub(): ReactFCWithDisplayName<CollapsibleComponentCardsProps> {
        return NamedFC<CollapsibleComponentCardsProps>('CollapsibleControlStub', _ => null);
    }
});
