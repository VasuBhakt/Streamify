export class SubscriptionService {

    async toggleSubscription({ channelId }) {
        try {
            const response = await axios.post(`/subscriptions/subscribe/${channelId}`)
            return response.data
        } catch (error) {
            console.log("SubscriptionService :: toggleSubscription :: error", error)
            throw error
        }
    }

    async getSubscriptions() {
        try {
            const response = await axios.get(`/subscriptions/subscribed`)
            return response.data
        } catch (error) {
            console.log("SubscriptionService :: getSubscriptions :: error", error)
            throw error
        }
    }

    async getSubscribers() {
        try {
            const response = await axios.get(`/subscriptions/subscribers`)
            return response.data
        } catch (error) {
            console.log("SubscriptionService :: getSubscribers :: error", error)
            throw error
        }
    }
}

const subscriptionService = new SubscriptionService()
export default subscriptionService
