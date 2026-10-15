<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <nav class="ck-inline-toc">
            <xsl:attribute name="aria-label">
                <xsl:choose>
                    <xsl:when test="/*/@aria-label"><xsl:value-of select="/*/@aria-label"/></xsl:when>
                    <xsl:otherwise>On this page</xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            
            <strong class="ck-inline-toc__label">
                <xsl:choose>
                    <xsl:when test="/*/@label"><xsl:value-of select="/*/@label"/></xsl:when>
                    <xsl:otherwise>On this page:</xsl:otherwise>
                </xsl:choose>
            </strong>
            
            <ck-children/>
            
        </nav>
    </xsl:template>
    
</xsl:stylesheet>