type Props = {
    user: any;
    refreshUser: () => void;
};

export default function UserProfile({
    user,
}: Props) {

    return (

        <section className="rounded-xl border border-my-gray/20 bg-white p-6">

            <h2 className="text-xl font-bold text-my-deep-blue mb-6">

                Profile

            </h2>

            <p className="text-my-gray">

                This section will contain the editable profile
                form (name, email, KYC, account status).

            </p>

        </section>

    );

}