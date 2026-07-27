type Props = {
    user: any;
    refreshUser: () => void;
};

export default function UserWallet({
    user,
}: Props) {

    return (

        <section className="rounded-xl border border-my-gray/20 bg-white p-6">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-xl font-bold text-my-deep-blue">

                        Wallet

                    </h2>

                    <p className="text-my-gray mt-1">

                        Current Balance

                    </p>

                </div>

                <div className="text-3xl font-bold">

                    ₦

                    {user.wallet?.balance.toLocaleString()}

                </div>

            </div>

            <button className="mt-8 rounded-xl bg-my-blue px-6 py-3 text-white">

                Adjust Wallet

            </button>

        </section>

    );

}