"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Lock, Unlock, CheckCircle, Loader2, AlertTriangle, Eye, Trash2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#0d0d0d_1px,transparent_1px),linear-gradient(to_bottom,#0d0d0d_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true"
      />
      {/* Navbar renders globally from layout.tsx — a second copy here stacked
          two navbars on this route. */}

      <main className="container mx-auto px-4 py-16">
        <Reveal
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-brand" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-brand to-blue-500 bg-clip-text text-transparent">
              Privacy Controls
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            NoTeachLLM - Control how your data is used for AI training
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <OptOutForm />
          <PrivacyStatus />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function OptOutForm() {
  const [formData, setFormData] = useState({
    user_id: "",
    email: "",
    reason: "",
    scope: "all",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/noteachllm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Opt-out failed");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-surface-1 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand" />
          Opt Out of AI Training
        </CardTitle>
        <CardDescription>
          Control how your data and contributions are used
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-surface-2 border-border"
            />
          </div>

          <div>
            <Label htmlFor="user_id">User ID (Optional)</Label>
            <Input
              id="user_id"
              placeholder="user-123"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="bg-surface-2 border-border"
            />
          </div>

          <div>
            <Label htmlFor="scope">Opt-Out Scope</Label>
            <Select
              value={formData.scope}
              onValueChange={(value) => setFormData({ ...formData, scope: value })}
            >
              <SelectTrigger className="bg-surface-2 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Complete Opt-Out (All)</SelectItem>
                <SelectItem value="learning">Learning Progress Only</SelectItem>
                <SelectItem value="teaching">Teaching Content Only</SelectItem>
                <SelectItem value="analytics">Analytics Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Why are you opting out?"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="bg-surface-2 border-border"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Opt Out
              </>
            )}
          </Button>
        </form>

        {result && (
          <Reveal
            className="mt-6 p-4 bg-green-900/30 border border-green-800 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-300 mb-1">
                  Successfully Opted Out!
                </h3>
                <p className="text-sm text-green-200 mb-2">{result.message}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="border-green-600 text-green-300">
                    ID: {result.opt_out_id}
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-300">
                    Scope: {result.scope}
                  </Badge>
                </div>
                <p className="text-xs text-green-400 mt-2">
                  Save your opt-out ID for future reference
                </p>
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-6 p-4 bg-surface-2/50 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            What does opting out mean?
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your data won't be used for AI training</li>
            <li>• Learning progress won't be tracked (if selected)</li>
            <li>• Your teaching contributions won't train AI models</li>
            <li>• Analytics tracking will be disabled</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function PrivacyStatus() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/noteachllm/status?email=${encodeURIComponent(email)}`
      );
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const revokeOptOut = async (optOutId: string) => {
    if (!confirm("Are you sure you want to revoke your opt-out? You'll be opted back in.")) return;

    try {
      const response = await fetch(`${API_URL}/api/noteachllm/${optOutId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setStatus({ opted_out: false, message: "Opt-out revoked successfully" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card className="bg-surface-1 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          Check Privacy Status
        </CardTitle>
        <CardDescription>
          View your current opt-out status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-2 border-border flex-1"
            />
            <Button onClick={checkStatus} disabled={loading || !email}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
            </Button>
          </div>

          {status && (
            <Reveal
              className={`p-4 rounded-lg border ${
                status.opted_out
                  ? "bg-green-900/30 border-green-800"
                  : "bg-surface-2 border-border"
              }`}
            >
              {status.opted_out ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-green-300">Opted Out</span>
                  </div>
                  <p className="text-sm text-foreground/80 mb-2">
                    You have opted out of AI training
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Scope: <span className="text-green-300">{status.scope}</span></p>
                    <p>Since: <span className="text-green-300">{new Date(status.timestamp).toLocaleDateString()}</span></p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeOptOut(status.id || status.opt_out_id)}
                    className="mt-3 border-red-800 text-red-400 hover:bg-red-900/30"
                  >
                    <Unlock className="w-3 h-3 mr-2" />
                    Revoke Opt-Out
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Unlock className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-yellow-400">Not Opted Out</span>
                  </div>
                  <p className="text-sm text-foreground/80">
                    {status.message || "Your data may be used for AI training"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use the form to opt out if you want more privacy
                  </p>
                </div>
              )}
            </Reveal>
          )}

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-300 mb-2">
              Your Privacy Rights
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                Right to opt out of AI training
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                Right to control data usage scope
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                Right to revoke opt-out at any time
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                Transparent data usage policies
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
