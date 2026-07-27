type Props = {
    user: any;
    refreshUser: () => void;
};

export default function UserInvestments({
    user,
}: Props) {

    return (

        <section className="rounded-xl border border-my-gray/20 bg-white p-6">

            <div className="flex justify-between mb-6">

                <h2 className="text-xl font-bold text-my-deep-blue">

                    Investments

                </h2>

                <button className="rounded-lg bg-my-blue px-5 py-2 text-white">

                    Add Investment

                </button>

            </div>

            <div className="space-y-4">

                {user.investments.map((investment: any) => (

                    <div
                        key={investment.id}
                        className="border rounded-lg p-5 flex justify-between items-center"
                    >

                        <div>

                            <h3 className="font-semibold">

                                {investment.assetClass.name}

                            </h3>

                            <p className="text-my-gray">

                                ₦

                                {investment.amount.toLocaleString()}

                            </p>

                        </div>

                        <div className="flex gap-2">

                            <button className="rounded-lg border px-4 py-2">

                                Edit

                            </button>

                            <button className="rounded-lg border border-red-500 text-red-500 px-4 py-2">

                                Delete

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );

}