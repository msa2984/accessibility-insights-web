// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import { cloneDeep, isEqual } from 'lodash';

export abstract class PersistentStore<TState> extends BaseStoreImpl<TState, Promise<void>> {
    private previouslyPersistedState: TState | null;

    constructor(
        storeName: StoreNames,
        protected readonly persistedState: TState,
        protected readonly idbInstance: IndexedDBAPI,
        protected readonly indexedDBDataKey: string,
        protected readonly logger: Logger,
        private persistStoreData: boolean,
    ) {
        super(storeName);
        this.previouslyPersistedState = null;
    }

    protected async persistData(storeData: TState): Promise<boolean> {
        if (this.persistStoreData && !isEqual(this.previouslyPersistedState, storeData)) {
            this.previouslyPersistedState = storeData;
            await this.idbInstance.setItem(this.indexedDBDataKey, storeData);
        }
        return true;
    }

    // Allow specific stores to override default state behavior
    protected generateDefaultState(persistedData: TState): TState {
        return persistedData;
    }

    public override initialize(initialState?: TState): void {
        if (this.persistStoreData) {
            const generatedPersistedState = this.generateDefaultState(this.persistedState);

            this.state = initialState || (generatedPersistedState ?? this.getDefaultState());

            this.addActionListeners();
        } else {
            super.initialize(initialState);
        }
    }

    public async teardown(): Promise<void> {
        if (this.persistStoreData) {
            await this.idbInstance.removeItem(this.indexedDBDataKey);
            this.previouslyPersistedState = null;
        }
    }

    protected async emitChanged(): Promise<void> {
        if (this.idbInstance && this.logger && this.persistStoreData) {
            const storeData = cloneDeep(this.getState());
            await this.persistData(storeData);
        }

        await super.emitChanged();
    }
}
