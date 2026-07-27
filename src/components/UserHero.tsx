type Props = {
    user: any;
};

export default function UserHero({
    user,
}: Props) {

    return (

        <section className="rounded-xl border border-my-gray/20 bg-white p-8">

            <h1 className="text-3xl font-bold text-my-deep-blue">

                {user.name}

            </h1>

            <p className="mt-2 text-my-gray">

                {user.email}

            </p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5">

                <div>
                    <p className="text-xs text-my-gray">
                        Account Type
                    </p>

                    <p className="font-medium">
                        {user.accountType}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-my-gray">
                        KYC
                    </p>

                    <p className="font-medium">
                        {user.kycStatus}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-my-gray">
                        Status
                    </p>

                    <p className="font-medium">
                        {user.accountStatus}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-my-gray">
                        Wallet
                    </p>

                    <p className="font-medium">

                        $

                        {user.wallet?.balance.toLocaleString()}

                    </p>
                </div>

            </div>

        </section>

    );

}