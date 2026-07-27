type Props = {
    user: any;
};

export default function UserActivity({
    user,
}: Props) {

    return (

        <section className="rounded-xl border border-my-gray/20 bg-white p-6">

            <h2 className="text-xl font-bold text-my-deep-blue mb-6">

                Activity

            </h2>

            <p className="text-my-gray">

                Wallet adjustments, investment history,
                notifications and support tickets will appear
                here.

            </p>

        </section>

    );

}