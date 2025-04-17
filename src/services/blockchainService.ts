import { ethers } from 'ethers';
import { historyData } from '@/lib/data/data';
import { HistoryEntry, MangaChange } from '@/types/history';
import { metadata } from '../app/layout';

// Interface for blockchain connection configuration
export interface BlockchainConfig {
  rpcUrl: string;
  contractAddress: string;
  apiKey?: string;
}

const fetchBlockchainConfig = async () => {
  try {
    const response = await fetch('/api/blockchain/config');
    if (!response.ok) {
      throw new Error('Failed to fetch blockchain configuration');
    }
    const config = await response.json();
    console.log('Config', config);
    return config.metadata;
  } catch (error) {
    console.error('Error fetching blockchain config:', error);

    return null;
  }
};

// Default configuration
const defaultConfig: BlockchainConfig = {
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:7545',
  contractAddress:
    process.env.CONTRACT_ADDRESS || '0xa556FDe944c946B89F36303aa35CB00ee7457B50'
};

// Contract ABI for interacting with the smart contract
const ABI = [
  'event StoryUpdated(uint256 indexed storyId, string cid, uint256 indexed timestamp)',
  'function updateStory(uint256 storyId, string memory newCID, address _ownerContract) public'
];

/**
 * Service to interact with blockchain for manga history data
 */
class BlockchainService {
  private config: BlockchainConfig;
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor(config: BlockchainConfig = defaultConfig) {
    this.config = config;
  }

  /**
   * Initialize connection to blockchain
   */
  async connect(): Promise<boolean> {
    console.log(`Connecting to blockchain at ${this.config.rpcUrl}`);
    try {
      // Initialize the provider
      this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      const address = await fetchBlockchainConfig();
      // Initialize the contract
      this.contract = new ethers.Contract(
        // this.config.contractAddress,
        address,
        ABI,
        this.provider
      );

      // Test connection by getting the network
      const network = await this.provider.getNetwork();
      console.log(`Connected to network: ${network.name} (${network.chainId})`);

      return true;
    } catch (error) {
      console.log('Failed to connect to blockchain:', error);
      this.provider = null;
      this.contract = null;
      return false;
    }
  }

  /**
   * Fetch a specific history entry by CID
   */
  async getHistoryByCID(cid: string): Promise<HistoryEntry | null> {
    try {
      console.log(`Fetching history with CID: ${cid}`);

      if (!cid) {
        console.log('No CID provided');
        return null;
      }

      // Fetch the data from IPFS
      return await this.fetchIPFSData(cid);
    } catch (error) {
      console.error(`Error fetching history with CID ${cid}:`, error);
      return null;
    }
  }

  /**
   * Get the latest version of a manga by ID
   */
  async getLatestMangaVersion(mangaId: number): Promise<HistoryEntry | null> {
    try {
      console.log(`Fetching latest version of manga ID: ${mangaId}`);

      if (!this.contract) {
        await this.connect();
        if (!this.contract) {
          throw new Error('Failed to establish blockchain connection');
        }
      }

      // Create a filter for StoryUpdated events with the specific mangaId
      const filter = this.contract.filters.StoryUpdated(mangaId);

      // Query all events matching the filter from block 0 to latest
      const events: any = await this.contract.queryFilter(filter, 0, 'latest');

      if (events.length === 0) {
        console.log(`No events found for manga ID: ${mangaId}`);
        return null;
      }

      // Get the latest event (last in the array)
      const latestEvent = events[events.length - 1];

      // Extract data from the event
      const eventData = {
        storyId: latestEvent.args[0].toString(),
        cid: latestEvent.args[1],
        timestamp: latestEvent.args[2].toString()
      };

      console.log('Latest event data:', eventData);

      // Fetch the corresponding history entry using the CID from the event
      const historyEntry = await this.fetchIPFSData(eventData.cid);

      return historyEntry;
    } catch (error) {
      console.error(
        `Error fetching latest manga version for ID ${mangaId}:`,
        error
      );
      return null;
    }
  }

  /**
   * Fetch data from IPFS using the CID
   * @param cid - Content Identifier for IPFS
   * @returns The history entry or null if not found
   */
  private async fetchIPFSData(cid: string): Promise<HistoryEntry | null> {
    try {
      if (!cid) return null;

      console.log(`Fetching IPFS data for CID: ${cid}`);

      // Use the IPFS gateway to fetch the data
      const response = await fetch(
        `https://gold-blank-bovid-152.mypinata.cloud/ipfs/${cid}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS content (${response.status})`);
      }

      const data: HistoryEntry = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching IPFS data for CID ${cid}:`, error);
      return null;
    }
  }

  /**
   * Get the complete version history for a manga
   * @param latestCid - The CID of the latest version
   * @returns Array of all version history entries
   */
  async getCompleteVersionHistory(latestCid: string): Promise<HistoryEntry[]> {
    if (!latestCid) {
      console.log('No CID provided to fetch version history');
      return [];
    }

    const history: HistoryEntry[] = [];
    let currentCid = latestCid;
    const processedCids = new Set<string>(); // To prevent infinite loops

    try {
      // Continue fetching until we reach a version with no previous version
      // or until we encounter a CID we've already processed
      while (currentCid && !processedCids.has(currentCid)) {
        console.log(`Fetching version data for CID: ${currentCid}`);
        processedCids.add(currentCid);

        // Fetch the current version data from IPFS
        const versionData = await this.fetchIPFSData(currentCid);

        if (!versionData) {
          console.log(`Failed to fetch IPFS content for CID: ${currentCid}`);
          break;
        }

        // Add this version to our history array
        history.push(versionData);

        // Move to the previous version
        currentCid = versionData.previousVersion;

        // Safety check - if we've processed too many versions, break to prevent
        // potential infinite loops or excessive API calls
        if (history.length > 100) {
          console.warn('Reached maximum history depth (100 versions)');
          break;
        }
      }

      // Sort the history by version number (descending)
      return history.sort((a, b) => b.version - a.version);
    } catch (error) {
      console.error('Error fetching complete version history:', error);
      return history; // Return whatever we've managed to fetch so far
    }
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService();

// Export the class for custom instantiation
export default BlockchainService;
