import { motion } from 'motion/react';
import { CreditCard, Share2, Loader2, CheckCircle2 } from 'lucide-react';

export interface CredentialProps {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  attributes: { name: string; value: string }[];
  status?: string;
  isRevoked?: boolean;
}

interface ComponentProps {
  credential: CredentialProps;
  onGenerateProof?: () => void;
  isProving?: boolean;
  showSuccess?: boolean;
}

export function CredentialCard({ credential, onGenerateProof, isProving, showSuccess }: ComponentProps) {
  const isIdentity = credential.status === 'Identity';
  const isPrivacy = credential.status === 'Privacy';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-base p-6 hover:border-slate-300 transition-colors group bg-white"
    >
      <div className="flex justify-between items-start mb-5">
        <div className={`p-2.5 rounded-lg ${isIdentity ? 'bg-blue-50' : isPrivacy ? 'bg-amber-50' : 'bg-slate-50'}`}>
          <CreditCard className={`w-5 h-5 ${isIdentity ? 'text-blue-600' : isPrivacy ? 'text-amber-600' : 'text-slate-600'}`} />
        </div>
        <div className="flex gap-2">
          {isIdentity && <span className="badge badge-blue">Identity</span>}
          {isPrivacy && <span className="badge badge-gold">Privacy</span>}
          {credential.isRevoked ? (
             <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-100">Revoked</span>
          ) : (
             <span className="badge badge-green">Verified</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{credential.type}</h3>
        <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
          Issued by {credential.issuer.slice(22, 28)} Authority • {credential.issuedAt}
        </p>
      </div>

      <div className="space-y-3 py-4 bg-slate-50/50 rounded-lg px-4 mb-5 border border-slate-100">
        {credential.attributes.map((attr, idx) => (
          <div key={idx} className="flex justify-between items-center text-[11px]">
            <span className="text-slate-500 font-medium uppercase tracking-wider">{attr.name}</span>
            <span className="font-bold text-slate-800">{attr.value}</span>
          </div>
        ))}
      </div>

      <button 
        disabled={isProving || showSuccess}
        onClick={onGenerateProof}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
          showSuccess 
            ? 'bg-green-600 text-white' 
            : isProving 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
        }`}
      >
        {isProving ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Generating ZK Proof...
          </>
        ) : showSuccess ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Proof Generated
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            Generate ZK Proof
          </>
        )}
      </button>
    </motion.div>
  );
}
