import type { Asset, VaultItem } from '@/types';
import { Info } from 'lucide-react';
import Image from 'next/image';
import VaultCard from './VaultCard';

export default function Vault({
  vaultType,
  asset,
  vault
}: Readonly<{ vaultType: 'apy' | 'tvl' | 'curator'; asset: Asset; vault: VaultItem }>) {
  return (
    <VaultCard>
      <div className="flex flex-col justify-between items-center h-full gap-4 p-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Image src={asset.logoURI} alt={vault.name} width={28} height={28} />
            <span>{vault.name}</span>
            <a href={`https://app.morpho.org/vault?vault=${vault.address}&network=${vault.network}`} target="_blank">
              <Info className="w-6 h-6 text-[#878888]" />
            </a>
          </div>
          <div className="flex bg-[#2b2e2f] rounded-full py-2 px-4 items-center justify-start gap-2">
            {vaultType === 'apy' && (
              <>
                <div className="rounded-full h-2 w-2 bg-[#dc5f27]" />
                <span className="text-sm">High APY</span>
              </>
            )}
            {vaultType === 'tvl' && (
              <>
                <div className="rounded-full h-2 w-2 bg-[#7fc241]" />
                <span className="text-sm">High TVL</span>
              </>
            )}
            {vaultType === 'curator' && (
              <>
                <div className="rounded-full h-2 w-2 bg-[#459eb2]" />
                <span className="text-sm">Trusted Curator</span>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <span>Total Supply</span>
          <span>100,000</span>
        </div>
        <div className="flex justify-between items-center w-full">
          <span>Net APY</span>
          <span>100,000</span>
        </div>
        <div className="flex justify-between items-center w-full">
          <span>Curator</span>
          <span>100,000</span>
        </div>
        <div className="flex justify-between items-center w-full">
          <span>Collateral</span>
          <span>100,000</span>
        </div>
        <button className="text-xl w-full rounded-[16px] bg-[#456DB5] py-2">Select Position</button>
      </div>
    </VaultCard>
  );
}
