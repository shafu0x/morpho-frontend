'use client';

import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useMorphoChainAgnosticBundlerV2 } from '@/hooks/useMorphoChainAgnosticBundlerV2';
import { useWETH } from '@/hooks/useWETH';
import { cn } from '@/lib/utils';
import abi from '@/shared/abi/MorphoChainAgnosticBundlerV2.json';
import { BundlerAction } from '@morpho-org/morpho-blue-bundlers/pkg';
import { useEffect, useState } from 'react';
import { encodeFunctionData, parseEther, parseUnits } from 'viem';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import FinalizeTransaction from './FinalizeTransaction';
import SelectSupplyToken from './SelectSupplyToken';

export default function EarnForm() {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const WETH = useWETH();
  const [amount, setAmount] = useState('');
  const { selectedAsset, selectedVault } = useAppContext();
  const finalAmount =
    selectedAsset?.address === WETH ? parseEther(amount) : parseUnits(amount, selectedAsset?.decimals || 18);
  const { data: hash, sendTransactionAsync } = useSendTransaction();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  const bundlerAddress = useMorphoChainAgnosticBundlerV2();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Transaction successful',
        description: 'Transaction hash: ' + hash
      });
    }
  }, [isSuccess, toast, hash]);

  const finalizeTransaction = async () => {
    if (!selectedVault || !selectedAsset) {
      return;
    }
  
    const actions = [];
  
    if (selectedAsset.address === WETH) {
      // If the asset is native ETH, wrap it
      actions.push(BundlerAction.wrapNative(finalAmount));
    }
  
    // Add the ERC-4626 deposit action regardless of asset type
    actions.push(
      BundlerAction.erc4626Deposit(selectedVault.address, selectedAsset.address, 1, address as string)
    );
  
    const data = encodeFunctionData({
      abi,
      functionName: 'multicall',
      args: [actions]
    });
  
    await sendTransactionAsync({
      to: bundlerAddress,
      data: data,
      value: selectedAsset.address === WETH ? finalAmount : '0' // Only send ETH if it's WETH (native)
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col justify-between items-center bg-[#1f2324] p-4 gap-4 h-full min-h-[60vh]',
        'border rounded-xl border-[#456DB5]'
      )}
    >
      <div className="flex flex-col w-full gap-4 justify-between items-center">
        <h1 className="text-4xl font-[500] text-[#456DB5]">Earn</h1>
        {isConnected && (
          <>
            <SelectSupplyToken amount={amount} setAmount={setAmount} />
          </>
        )}
      </div>
      <div className="flex flex-col gap-4 justify-between items-center">
        <span className="text-[#919AAF] text-center">
          Morpho is the most efficient, secure, and flexible lending protocol on Ethereum.
        </span>
        <FinalizeTransaction disabled={!(amount !== '' && selectedVault)} finalizeTransaction={finalizeTransaction} />
      </div>
    </div>
  );
}
