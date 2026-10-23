<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <div class="document-author">
      <span class="document-author-name">
        <xsl:value-of select="/*/@name"/>
      </span>
      <xsl:if test="/*/@role!=''">
        <span class="document-author-role"> · <xsl:value-of select="/*/@role"/></span>
      </xsl:if>
    </div>
  </xsl:template>
</xsl:stylesheet>
