"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Settings, Send, Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react"

interface WhatsAppConfig {
  accessToken: string
  phoneNumberId: string
  businessAccountId: string
  webhookUrl: string
  isConnected: boolean
}

interface MessageTemplate {
  id: string
  name: string
  category: string
  language: string
  status: "approved" | "pending" | "rejected"
  content: string
}

interface SentMessage {
  id: string
  recipient: string
  template: string
  status: "sent" | "delivered" | "read" | "failed"
  sentAt: string
}

export default function WhatsAppPage() {
  const [config, setConfig] = useState<WhatsAppConfig>({
    accessToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    webhookUrl: "",
    isConnected: false,
  })

  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      name: "order_confirmation",
      category: "TRANSACTIONAL",
      language: "en",
      status: "approved",
      content: "Hi {{1}}, your order #{{2}} has been confirmed! Total: ${{3}}. Expected delivery: {{4}}.",
    },
    {
      id: "2",
      name: "shipping_update",
      category: "TRANSACTIONAL",
      language: "en",
      status: "approved",
      content: "Your order #{{1}} is on its way! Track your package: {{2}}",
    },
    {
      id: "3",
      name: "promotional_offer",
      category: "MARKETING",
      language: "en",
      status: "pending",
      content: "🎉 Special offer for you! Get 20% off on all bags. Use code: SAVE20. Valid until {{1}}.",
    },
  ])

  const [sentMessages, setSentMessages] = useState<SentMessage[]>([
    {
      id: "1",
      recipient: "+1 (555) 123-4567",
      template: "order_confirmation",
      status: "delivered",
      sentAt: "2024-01-15 10:30:00",
    },
    {
      id: "2",
      recipient: "+1 (555) 987-6543",
      template: "shipping_update",
      status: "read",
      sentAt: "2024-01-15 09:15:00",
    },
    {
      id: "3",
      recipient: "+1 (555) 456-7890",
      template: "promotional_offer",
      status: "sent",
      sentAt: "2024-01-15 08:45:00",
    },
  ])

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    language: "en",
    content: "",
  })

  const [sendMessage, setSendMessage] = useState({
    recipient: "",
    template: "",
    parameters: "",
  })

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)

  const handleSaveConfig = () => {
    setConfig({ ...config, isConnected: true })
  }

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      const template: MessageTemplate = {
        id: Date.now().toString(),
        name: newTemplate.name,
        category: newTemplate.category,
        language: newTemplate.language,
        status: "pending",
        content: newTemplate.content,
      }
      setTemplates([...templates, template])
      setNewTemplate({ name: "", category: "", language: "en", content: "" })
      setIsTemplateDialogOpen(false)
    }
  }

  const handleSendMessage = () => {
    if (sendMessage.recipient && sendMessage.template) {
      const message: SentMessage = {
        id: Date.now().toString(),
        recipient: sendMessage.recipient,
        template: sendMessage.template,
        status: "sent",
        sentAt: new Date().toLocaleString(),
      }
      setSentMessages([message, ...sentMessages])
      setSendMessage({ recipient: "", template: "", parameters: "" })
      setIsSendDialogOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "read":
        return <Badge className="bg-purple-100 text-purple-800">Read</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "read":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "sent":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">WhatsApp Integration</h2>
        <div className="flex items-center gap-2">
          {config.isConnected ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <XCircle className="mr-1 h-3 w-3" />
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="send">Send Messages</TabsTrigger>
          <TabsTrigger value="history">Message History</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                WhatsApp Business API Configuration
              </CardTitle>
              <CardDescription>
                Configure your Meta WhatsApp Business API credentials to start sending messages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accessToken">Access Token</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    value={config.accessToken}
                    onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                    placeholder="Enter your access token"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                  <Input
                    id="phoneNumberId"
                    value={config.phoneNumberId}
                    onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                    placeholder="Enter phone number ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAccountId">Business Account ID</Label>
                  <Input
                    id="businessAccountId"
                    value={config.businessAccountId}
                    onChange={(e) => setConfig({ ...config, businessAccountId: e.target.value })}
                    placeholder="Enter business account ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Switch
                  id="enable-notifications"
                  checked={config.isConnected}
                  onCheckedChange={(checked) => setConfig({ ...config, isConnected: checked })}
                /> */}
                <Label htmlFor="enable-notifications">Enable WhatsApp notifications</Label>
              </div>
              <Button onClick={handleSaveConfig} className="w-full md:w-auto">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Message Templates</h3>
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Message Template</DialogTitle>
                  <DialogDescription>
                    Create a new WhatsApp message template. Templates must be approved by Meta before use.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="e.g., order_confirmation"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                          <SelectItem value="MARKETING">Marketing</SelectItem>
                          <SelectItem value="UTILITY">Utility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={newTemplate.language}
                        onValueChange={(value) => setNewTemplate({ ...newTemplate, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Message Content</Label>
                    <Textarea
                      id="content"
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                      placeholder="Enter your message template. Use {{1}}, {{2}}, etc. for variables."
                      rows={4}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTemplate}>Create Template</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{template.language}</TableCell>
                      <TableCell>{getStatusBadge(template.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send WhatsApp Message
              </CardTitle>
              <CardDescription>Send messages to customers using approved templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Phone Number</Label>
                  <Input
                    id="recipient"
                    value={sendMessage.recipient}
                    onChange={(e) => setSendMessage({ ...sendMessage, recipient: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Message Template</Label>
                  <Select onValueChange={(value) => setSendMessage({ ...sendMessage, template: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter((t) => t.status === "approved")
                        .map((template) => (
                          <SelectItem key={template.id} value={template.name}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parameters">Template Parameters (comma-separated)</Label>
                <Input
                  id="parameters"
                  value={sendMessage.parameters}
                  onChange={(e) => setSendMessage({ ...sendMessage, parameters: e.target.value })}
                  placeholder="John Doe, ORD123, $299.99, Jan 20"
                />
              </div>
              <Button onClick={handleSendMessage} disabled={!config.isConnected}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
              <CardDescription>Track all sent WhatsApp messages and their delivery status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead className="hidden md:table-cell">Sent At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.recipient}</TableCell>
                      <TableCell>{message.template}</TableCell>
                      <TableCell className="hidden md:table-cell">{message.sentAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(message.status)}
                          {getStatusBadge(message.status)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
