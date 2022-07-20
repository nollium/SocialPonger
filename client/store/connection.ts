import Vue from "vue";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { ChanConnection } from "@/models/ChanConnection";
import { store } from "@/store";
import { DeepPartial } from "@/types/partial";

export interface IConnectionStore {
	chanConnections: Array<ChanConnection>;
}

@Module({ stateFactory: true, namespaced: true, name: "connection" })
export default class ConnectionStore extends VuexModule implements IConnectionStore {
	public chanConnections: ChanConnection[] = [];

	@Mutation
	setChanConnections(chanConnections: ChanConnection[]) {
		this.chanConnections = chanConnections;
	}

	@Mutation
	async pushChanConnection(chanConnection: ChanConnection) {
		const index = this.chanConnections.findIndex((r) => r.id === chanConnection.id);
		if (index !== -1) {
			await this.chanConnections.splice(index, 1, chanConnection);
		} else {
			await this.chanConnections.push(chanConnection);
		}
	}

	@Mutation
	pushChanConnectionFront(connections: ChanConnection[]) {
		this.chanConnections = connections.concat(this.chanConnections);
	}

	@Mutation
	removeChanConnection(chanConnection: ChanConnection) {
		this.chanConnections = this.chanConnections.filter((m) => m.id !== chanConnection.id);
	}

	@Action
	async retrieveChanConnections(page = 1) {
		if (store.channel.currentChannel.channel?.name === undefined) return;
		if (page === 1) this.setChanConnections([]);
		await Vue.prototype.api.get(
			`/channels/${store.channel.currentChannel.channel.id}/chan_connections`,
			{ page, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				const connections = r.data;
				const myConnection = r.data.find((c) => c.user.id === store.user.me.id);
				if (myConnection) {
					store.channel.setCurrentRole(myConnection.role);
				}
				this.pushChanConnectionFront(connections);
				if (connections.length === 100) {
					this.retrieveChanConnections(page + 1);
				}
			},
		);
	}

	@Action
	async retrieveMyConnections(page = 1) {
		if (page === 1) store.channel.setMyChannels([]);
		await Vue.prototype.api.get(
			"/users/" + (await store.user.me.id) + "/chan_connections",
			{ page, per_page: 100 },
			(r: { data: ChanConnection[] }) => {
				store.channel.pushMyChannelsFront(r.data.map((c) => c.channel));
				if (r.data.length === 100) {
					this.retrieveMyConnections(page + 1);
				}
			},
		);
	}

	@Action
	async retrieveChanConnection(id: number) {
		await Vue.prototype.api.get(`/connections/${id}`, {}, async (r: { data: ChanConnection }) => {
			await this.pushChanConnection(r.data);
		});
	}

	@Action
	async retrieveMyConnection(id: number) {
		await Vue.prototype.api.get(`/connections/${id}`, {}, async (r: { data: ChanConnection }) => {
			await store.channel.pushMyChannels(r.data.channel);
		});
	}

	@Action
	async updateChanConnection(connection: DeepPartial<ChanConnection>) {
		await Vue.prototype.api.put(`/connections/${connection.id}`, connection, {}, (r: { data: ChanConnection }) => {
			this.pushChanConnection(r.data);
		});
	}
}
