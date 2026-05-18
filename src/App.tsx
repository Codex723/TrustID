import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Plus, 
  LayoutDashboard,
  Wallet,
  History,
  Code2,
  ChevronRight,
  ArrowUpRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { CredentialCard } from './components/CredentialCard';

// Mock data
const INITIAL_DID = "did:stellar:soroban:GBCC...Y7M2";
const MOCK_CREDENTIALS = [
  {
    id: "cred_82194712",
    type: "Verifiable Passport",
    issuer: "did:stellar:gov:issuer_ae2",
    issuedAt: "2024-03-15",
    attributes: [
      { name: "Nationality", value: "DE" },
      { name: "Date of Birth", value: "1992-04-12" }
    ],
    status: "Identity"
  },
  {
    id: "cred_19283745",
    type: "Driver's License",
    issuer: "did:stellar:gov:issuer_tr3",
    issuedAt: "2023-11-20",
    attributes: [
      { name: "Category", value: "B, BE" }
    ],
    status: "Standard"
  },
  {
    id: "cred_55667788",
    type: "ZK Age Proof (18+)",
    issuer: "did:stellar:gov:zk_issuer",
    issuedAt: "2024-01-10",
    attributes: [
      { name: "Proof type", value: "Range Proof" },
      { name: "Curve", value: "BLS12-381" }
    ],
    status: "Privacy"
  }
];

export default function App() {
  const [credentials] = useState(MOCK_CREDENTIALS);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isRequesting, setIsRequesting] = useState(false);
  const [provingCred, setProvingCred] = useState<string | null>(null);
  const [proofStatus, setProofStatus] = useState<'idle' | 'generating' | 'success'>('idle');

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Wallet", icon: Wallet },
    { name: "Verifier SDK", icon: Code2 },
    { name: "Audit Log", icon: History },
  ];

  const handleGenerateProof = (id: string) => {
    setProvingCred(id);
    setProofStatus('generating');
    // Simulate ZK Proof generation
    setTimeout(() => {
      setProofStatus('success');
      setTimeout(() => {
        setProofStatus('idle');
        setProvingCred(null);
      }, 3000);
    }, 2500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent Credentials</h2>
                  <p className="text-xs text-slate-500 mt-1">Your latest verifiable identities on Stellar</p>
                </div>
                <button 
                  onClick={() => setIsRequesting(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-shadow shadow-lg shadow-violet-200 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Request
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {credentials.slice(0, 2).map((cred) => (
                  <CredentialCard 
                    key={cred.id} 
                    credential={cred} 
                    onGenerateProof={() => handleGenerateProof(cred.id)}
                    isProving={provingCred === cred.id && proofStatus === 'generating'}
                    showSuccess={provingCred === cred.id && proofStatus === 'success'}
                  />
                ))}
              </div>
              <AuditLogTable limit={3} />
            </div>
            <div className="space-y-8">
              <RoadmapCard />
              <ProtocolStatusCard />
            </div>
          </div>
        );
      case "Wallet":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Credential Wallet</h2>
                <p className="text-xs text-slate-500 mt-1">Manage all your stored verifiable documents</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">Filter</button>
                <button 
                  onClick={() => setIsRequesting(true)}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 active:scale-95"
                >
                  Add New
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {credentials.map((cred) => (
                  <CredentialCard 
                    key={cred.id} 
                    credential={cred} 
                    onGenerateProof={() => handleGenerateProof(cred.id)}
                    isProving={provingCred === cred.id && proofStatus === 'generating'}
                    showSuccess={provingCred === cred.id && proofStatus === 'success'}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      case "Verifier SDK":
        return <VerifierSDKView />;
      case "Audit Log":
        return <AuditLogTable />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-slate-100 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">T</div>
          <span className="text-xl font-bold tracking-tight">TrustID</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.name 
                ? 'bg-[#1E293B] text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800/40 p-4 rounded-xl">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Network</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-slate-300">Soroban Testnet</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{activeTab}</h1>
            <p className="text-xs text-slate-500">Decentralized Identity on Stellar Soroban</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-600 border border-slate-200">
              {INITIAL_DID.slice(0, 16)}...
            </div>
            <div className="w-9 h-9 bg-slate-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1240px] mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* simulated Request Modal */}
      {isRequesting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-2">Request New Credential</h3>
            <p className="text-sm text-slate-500 mb-6">Choose an authorized issuer to verify your attributes.</p>
            
            <div className="space-y-4 mb-8">
              {['Government Authority (Passport)', 'University Registry (Degree)', 'Financial Institution (KYC)'].map((issuer) => (
                <button key={issuer} className="w-full p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors text-left font-medium text-slate-700">
                  {issuer}
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsRequesting(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsRequesting(false)}
                className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700"
              >
                Initiate Flow
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Sub-components to keep renderContent clean
function AuditLogTable({ limit }: { limit?: number }) {
  const allLogs = [
    { action: "Credential Issued", block: "#49,201", status: "Success", time: "2m ago" },
    { action: "DID Document Update", block: "#48,155", status: "Success", time: "1h ago" },
    { action: "Proof Verification", block: "#47,902", status: "Success", time: "3h ago" },
    { action: "Credential Revocation", block: "#46,211", status: "Success", time: "1d ago" },
    { action: "Key Rotation", block: "#45,998", status: "Success", time: "2d ago" },
  ];
  const logs = limit ? allLogs.slice(0, limit) : allLogs;

  return (
    <div className="card-base p-6">
      <h2 className="text-sm font-bold text-slate-900 mb-6">On-Chain Audit Log</h2>
      <div className="overflow-x-auto text-xs">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="text-left pb-4 font-bold">Action</th>
              <th className="text-left pb-4 font-bold">Block</th>
              <th className="text-left pb-4 font-bold">Time</th>
              <th className="text-right pb-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {logs.map((log, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0">
                <td className="py-4 font-medium">{log.action}</td>
                <td className="py-4 font-mono">{log.block}</td>
                <td className="py-4 text-slate-400">{log.time}</td>
                <td className="py-4 text-right text-green-600 font-bold">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoadmapCard() {
  return (
    <div className="card-base overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">GitHub Roadmap</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {[
          { label: "Good first issue", text: "TypeScript types for DIDDocument and VC.", color: "bg-green-500" },
          { label: "Medium task", text: "Implement on-chain issuance in Soroban.", color: "bg-blue-500" },
          { label: "Hard task", text: "Build ZK proof module (BLS12-381).", color: "bg-violet-500" }
        ].map((issue, idx) => (
          <div key={idx} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${issue.color}`} />
              <span className="text-xs font-bold text-slate-900">{issue.label}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-600">
              {issue.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtocolStatusCard() {
  return (
    <div className="card-base p-6 bg-[#0F172A] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Shield className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-bold mb-3">Protocol Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Network</span>
            <span className="text-xs font-mono font-bold text-blue-400">Soroban Testnet</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Contract</span>
            <span className="text-xs font-mono font-bold text-violet-400">0x82...a19c</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">SDK Status</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifierSDKView() {
  return (
    <div className="space-y-8">
      <div className="card-base p-8 bg-slate-900 text-white">
        <h2 className="text-xl font-bold mb-4">Integrate TrustID Verifier</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-2xl">
          The TrustID SDK allows dApps to request and verify ZK proofs from users without accessing raw identity data. 
          Use the snippet below to get started on Stellar.
        </p>
        <div className="bg-[#1E293B] p-6 rounded-xl font-mono text-sm text-blue-300 border border-white/5 space-y-2">
          <p><span className="text-slate-500">// 1. Install SDK</span></p>
          <p>npm install @trustid/sdk</p>
          <p className="pt-4"><span className="text-slate-500">// 2. Initialize Verifier</span></p>
          <p><span className="text-violet-400">import</span> &#123; Verifier &#125; <span className="text-violet-400">from</span> <span className="text-amber-300">'@trustid/sdk'</span>;</p>
          <p><span className="text-violet-400">const</span> verifier = <span className="text-violet-400">new</span> Verifier(&#123; network: <span className="text-amber-300">'testnet'</span> &#125;);</p>
          <p className="pt-4"><span className="text-slate-500">// 3. Verify Attribute Proof</span></p>
          <p><span className="text-violet-400">const</span> result = <span className="text-violet-400">await</span> verifier.verify(proof, <span className="text-amber-300">'age_over_18'</span>);</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-base p-6">
          <h3 className="text-sm font-bold mb-4">API References</h3>
          <div className="space-y-3">
            {['.verify(proof, attribute)', '.createRequest(attributes)', '.getDIDStatus(did)'].map(api => (
              <div key={api} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
                <code className="text-xs font-bold text-slate-700">{api}</code>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500" />
              </div>
            ))}
          </div>
        </div>
        <div className="card-base p-6 border-violet-100 bg-violet-50/10">
          <h3 className="text-sm font-bold text-violet-900 mb-4">Secure ZK Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            All verification calls perform a series of pairing checks on the BLS12-381 curve and cross-reference the on-chain Soroban audit log for revocation status.
          </p>
          <button className="text-xs font-bold text-violet-600 flex items-center gap-2">
            Read Security Audit
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}


