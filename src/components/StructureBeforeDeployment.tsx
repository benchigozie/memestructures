import { Layers, ShieldAlert, Upload  } from "lucide-react"
function StructureBeforeDeployment() {



    return (
        <section className='bg-my-white mt-18'>
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Structure Before Deployment</h2>
                <p className="text-center text-lg mt-3">We apply institutional rigor, strict downside controls, and complete fee alignment to long-term digital asset allocation</p>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5 mt-14 bg-my-white shadow-my-gray/10 hover:cursor-pointer shadow-xl rounded-xl p-3 transition-all duration-300 max-w-3xl mx-auto'>
                  <div className="md:bg-my-blue p-3 rounded-xl flex gap-3 md:text-my-blue-white"><Layers /><p>Four-Lens Framework</p></div>
                  <div className="p-3 rounded-xl flex gap-3"><ShieldAlert /><p>Risk Controls</p></div>
                  <div className="p-3 rounded-xl flex gap-3"><Upload /><p>Fee Alignment</p></div>
                </div>
                
            </div>
        </section>
    )
}

export default StructureBeforeDeployment