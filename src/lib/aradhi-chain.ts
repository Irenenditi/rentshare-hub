// Browser-only Web3 helpers for Aradhi. Import lazily (inside effects/handlers)
// so ethers never runs during SSR.

export const ARADHI_CONTRACT_ADDRESS = "0xYourNewAradhiContractAddress";

export const ARADHI_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function getPendingRent(address owner) view returns (uint256)",
];

export type OnChainBalances = { shares: number; pendingRent: number };

function getInjectedProvider(): unknown {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: unknown }).ethereum;
}

export function hasInjectedProvider(): boolean {
  return Boolean(getInjectedProvider());
}

export async function readOnChainBalances(userAddress: string): Promise<OnChainBalances | null> {
  const injected = getInjectedProvider();
  if (!injected) return null;

  const { BrowserProvider, Contract, formatUnits } = await import("ethers");
  const provider = new BrowserProvider(injected as never);
  const contract = new Contract(ARADHI_CONTRACT_ADDRESS, ARADHI_ABI, provider);

  const [rawShares, rawRent] = await Promise.all([
    contract["balanceOf"]!(userAddress) as Promise<bigint>,
    contract["getPendingRent"]!(userAddress) as Promise<bigint>,
  ]);

  return {
    shares: Number(formatUnits(rawShares, 0)),
    // Rent is paid in USDC (6 decimals).
    pendingRent: Number(formatUnits(rawRent, 6)),
  };
}
