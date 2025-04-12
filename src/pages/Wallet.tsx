
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, DollarSign, Plus, History, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { walletService, WalletTransaction } from "@/services/walletService";
import { format } from "date-fns";

const Wallet = () => {
  const navigate = useNavigate();
  const { currentUser, addFunds } = useApp();
  const [amount, setAmount] = useState<string>("25");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleAddFunds = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addFunds(Number(amount));
      if (result.success) {
        toast.success(`Successfully added $${amount} to your wallet`);
        setAmount("");
      } else {
        toast.error(result.error || "Failed to add funds");
      }
    } catch (error) {
      toast.error("An error occurred while processing your payment");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactionHistory = async () => {
    if (!currentUser) return;
    
    setIsLoadingHistory(true);
    try {
      const history = await walletService.getTransactionHistory(currentUser.id);
      setTransactions(history);
    } catch (error) {
      console.error("Failed to load transaction history:", error);
      toast.error("Could not load your transaction history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-warmBrown">Wallet</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your Balance</CardTitle>
                  <CardDescription>Manage your SmartGifter wallet</CardDescription>
                </div>
                <div className="h-12 w-12 rounded-full bg-peachBlush/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-dustyRose" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-6">${currentUser.walletBalance.toFixed(2)}</div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-bold"
                    onClick={() => setAmount("25")}
                  >
                    $25
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-bold"
                    onClick={() => setAmount("50")}
                  >
                    $50
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-lg font-bold"
                    onClick={() => setAmount("100")}
                  >
                    $100
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      type="number"
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-9"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddFunds}
                    disabled={isLoading}
                    className="gift-btn"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add Funds
                  </Button>
                </div>
                
                <Button className="w-full" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Payment Methods
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Transaction History</CardTitle>
                  <CardDescription>Your recent wallet activity</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={loadTransactionHistory}
                  disabled={isLoadingHistory}
                >
                  {isLoadingHistory ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <History className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all">
                <div className="px-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                    <TabsTrigger value="deposits" className="flex-1">Deposits</TabsTrigger>
                    <TabsTrigger value="spent" className="flex-1">Spent</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all">
                  <TransactionList transactions={transactions} isLoading={isLoadingHistory} />
                </TabsContent>
                
                <TabsContent value="deposits">
                  <TransactionList 
                    transactions={transactions.filter(tx => tx.type === "deposit")}
                    isLoading={isLoadingHistory} 
                  />
                </TabsContent>
                
                <TabsContent value="spent">
                  <TransactionList 
                    transactions={transactions.filter(tx => tx.type !== "deposit")}
                    isLoading={isLoadingHistory} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

const TransactionList = ({ 
  transactions, 
  isLoading 
}: { 
  transactions: WalletTransaction[],
  isLoading: boolean 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>No transactions to display</p>
        <p className="text-sm">Your transaction history will appear here</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-auto max-h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">
                {format(new Date(tx.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{tx.description}</TableCell>
              <TableCell className={`text-right ${tx.type === "deposit" ? "text-emerald-600" : "text-red-500"}`}>
                {tx.type === "deposit" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Wallet;
