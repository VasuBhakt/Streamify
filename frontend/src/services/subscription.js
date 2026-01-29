import axios from "../utils/axios";

export class SubscriptionService {
    async toggleSubscription(channelId) {
        try {
            const response = await axios.post(`/subscriptions/c/${channelId}`);
            return response.data;
        } catch (error) {
            console.error("SubscriptionService :: toggleSubscription :: error", error);
            throw error;
        }
    }

    async getSubscribedChannels() {
        try {
            const response = await axios.get(`/subscriptions/user`);
            return response.data;
        } catch (error) {
            console.error("SubscriptionService :: getSubscribedChannels :: error", error);
            throw error;
        }
    }

    async getUserChannelSubscribers(channelId) {
        try {
            const response = await axios.get(`/subscriptions/c/${channelId}`);
            return response.data;
        } catch (error) {
            console.error("SubscriptionService :: getUserChannelSubscribers :: error", error);
            throw error;
        }
    }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
