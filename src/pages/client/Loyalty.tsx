import React, { useEffect, useState } from 'react';
import { Gift, Star, History, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { loyaltyService } from '@/services/api';
import { LoyaltyReward, LoyaltyTransaction, UserReward } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Loyalty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [userRewards, setUserRewards] = useState<(UserReward & { reward: LoyaltyReward })[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const [rewardsData, transactionsData, userRewardsData] = await Promise.all([
        loyaltyService.getRewards(),
        loyaltyService.getUserTransactions(user.id),
        loyaltyService.getUserRewards(user.id),
      ]);
      setRewards(rewardsData);
      setTransactions(transactionsData);
      setUserRewards(userRewardsData);
    } catch (error) {
      console.error('Failed to load loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId: string) => {
    if (!user) return;
    setRedeeming(rewardId);
    try {
      const result = await loyaltyService.redeemReward(user.id, rewardId);
      if (result) {
        toast({
          title: 'Reward Redeemed!',
          description: 'Your reward has been added to your account.',
        });
        loadData();
      } else {
        toast({
          title: 'Redemption Failed',
          description: 'Not enough points or reward unavailable.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to redeem reward.',
        variant: 'destructive',
      });
    } finally {
      setRedeeming(null);
    }
  };

  const userPoints = user?.loyaltyPoints || 0;
  const nextTier = userPoints >= 1000 ? 'VIP' : userPoints >= 500 ? 'Gold' : 'Silver';
  const tierProgress = userPoints >= 1000 ? 100 : userPoints >= 500 ? ((userPoints - 500) / 500) * 100 : (userPoints / 500) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Loyalty Rewards</h1>
        <p className="text-muted-foreground">Earn points and redeem exclusive rewards</p>
      </div>

      {/* Points Overview */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Points Balance</p>
                <p className="text-4xl font-bold text-primary">{userPoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress to {nextTier}</span>
                <Badge variant="secondary">{Math.round(tierProgress)}%</Badge>
              </div>
              <Progress value={tierProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Available Rewards
          </TabsTrigger>
          <TabsTrigger value="my-rewards" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            My Rewards
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map(reward => {
              const canRedeem = userPoints >= reward.pointsCost;
              return (
                <Card key={reward.id} className={!canRedeem ? 'opacity-60' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Gift className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant={reward.discountType === 'percentage' ? 'secondary' : 'outline'}>
                        {reward.discountType === 'percentage' 
                          ? `${reward.discountValue}% OFF` 
                          : `$${reward.discountValue} OFF`}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{reward.name}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <Star className="h-4 w-4 fill-primary" />
                        {reward.pointsCost.toLocaleString()} pts
                      </div>
                      <Button
                        size="sm"
                        disabled={!canRedeem || redeeming === reward.id}
                        onClick={() => handleRedeem(reward.id)}
                      >
                        {redeeming === reward.id ? 'Redeeming...' : 'Redeem'}
                      </Button>
                    </div>
                    {reward.expiryDays && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Valid for {reward.expiryDays} days after redemption
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my-rewards" className="mt-6">
          {userRewards.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No rewards redeemed yet</p>
                <Button variant="outline" className="mt-4" onClick={() => {}}>
                  Browse Rewards
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userRewards.map(ur => (
                <Card key={ur.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Gift className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{ur.reward.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Redeemed {format(new Date(ur.redeemedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {ur.isUsed ? (
                        <Badge variant="secondary">Used</Badge>
                      ) : ur.expiresAt && new Date(ur.expiresAt) < new Date() ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : (
                        <Badge variant="confirmed">Active</Badge>
                      )}
                      {ur.expiresAt && !ur.isUsed && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires {format(new Date(ur.expiresAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  transactions.map(tx => (
                    <div key={tx.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          tx.type === 'earned' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                        }`}>
                          {tx.type === 'earned' ? (
                            <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Gift className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${tx.type === 'earned' ? 'text-green-600' : 'text-orange-600'}`}>
                        {tx.type === 'earned' ? '+' : ''}{tx.points} pts
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Loyalty;
